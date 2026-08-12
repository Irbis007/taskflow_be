import { Router } from "express";
import { userController } from "../controllers/userController";
import { body } from "express-validator";
const router = Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration,
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refetch", userController.refresh);

export const authRouter = router;
