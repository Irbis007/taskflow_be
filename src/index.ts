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
  const userId = socket.handshake?.auth?.user?.id;
  console.log(`connect to the socket: ${userId}`);
  socket.join(`user:${userId}`);

  const users = await userModel.find().lean();

  users.forEach((u) => {
    io.to(`user:${u._id}`).emit("user:online", { userId, isOnline: true });
  });

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
    console.log("start", userId, companionId);
    if (userId) {
      io.to(`user:${companionId}`).emit("typing:start", { chatId, userId });
    }
  });
  socket.on("typing:end", ({ chatId, companionId }) => {
    console.log("start", userId, companionId);
    if (userId) {
      io.to(`user:${companionId}`).emit("typing:end", { userId, chatId });
    }
  });

  socket.on("disconnect", async () => {
    console.log("user disconnected");
    users.forEach((u) => {
      io.to(`user:${u.id}`).emit("user:online", { userId, isOnline: false });
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
