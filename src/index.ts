import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import {
  authRouter,
  chatRouter,
  projectRoute,
  tagRoute,
  taskRoute,
} from "./route/index";
import errorMiddleware from "./middlewares/error-middleware";

import swaggerUi from "swagger-ui-express";
import { document } from "./swagger/generateSchema";
import { usersRoute } from "./route/usersRoute";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { chatServices } from "./service/chat-services";
import chatModel from "./models/chat-model";
import userModel from "./models/user-model";
import { commentService } from "./service/comment-service";
import { decodeJwt } from "./utils/jwtDecode";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://taskflow-fe.onrender.com"],
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api", taskRoute);
app.use("/api", projectRoute);
app.use("/api", usersRoute);
app.use("/api", tagRoute);
app.use("/api", chatRouter);
app.use(errorMiddleware);

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(document));
app.get("/api-scheme", (req, res) => res.json(document));
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://taskflow-fe.onrender.com"],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  const cookieHeader = socket.handshake.headers.cookie;
  const refreshToken = cookieHeader
    ?.split("; ")
    .find((cookie) => cookie.startsWith("refreshToken="))
    ?.split("=")[1];
  const userId = decodeJwt(refreshToken)?.id.toString();
  if (!userId) return;

  socket.join(`user:${userId}`);
  const sockets = await io.fetchSockets();

  const usersOnline = sockets.map((socket) => socket.handshake?.auth?.userId);

  usersOnline.forEach((u) => {
    io.to(`user:${u}`).emit("user:online", {
      userId,
    });
  });

  socket.on("users:getOnline", async () => {
    socket.emit("users:online", usersOnline);
  });
  socket.emit("users:online", usersOnline);

  socket.on("message:send", async (chat, callback) => {
    if (userId) {
      const message = await chatServices.createMessage(chat, userId);
      const chatData = await chatModel.findById(message.chatId).lean();
      const members = chatData?.members || [];
      members.forEach((id) => {
        io.to(`user:${id}`).emit("chat:new-message", {
          chatId: message.chatId,
          message: message,
        });
      });
      callback();
    }
  });

  socket.on("typing:start", ({ chatId, companionId }) => {
    if (userId) {
      io.to(`user:${companionId}`).emit("typing:start", { chatId, userId });
    }
  });
  socket.on("typing:end", ({ chatId, companionId }) => {
    if (userId) {
      io.to(`user:${companionId}`).emit("typing:end", { userId, chatId });
    }
  });

  socket.on("disconnect", async () => {
    const sockets = await io.fetchSockets();

    const usersOnline = sockets.map((socket) => socket.handshake?.auth?.userId);

    usersOnline.forEach((u) => {
      io.to(`user:${u}`).emit("user:offline", {
        userId,
      });
    });
  });
});

server.listen(PORT, () => {
  console.log(`sockets running at ${PORT}`);
});

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("connected");
    app.listen(PORT, () => console.log(`server start at ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
