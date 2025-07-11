import express from "express";
import { listUser } from "../controllers/user.controller.js";
import { authAdminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = express.Router()

//Get All user ENDPOINT -> http://localhost:3210/api/users
userRouter.get("/users", authMiddleware, authAdminMiddleware, listUser)

export default userRouter