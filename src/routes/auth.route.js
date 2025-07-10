import express from "express";
import { forgotPassword, login, me, register, resetPassword } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authMiddleware, me)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password/:token", resetPassword)

export default authRouter