import express from "express";
import { listUser } from "../controllers/user.controller.js";

const userRouter = express.Router()

//Get All user ENDPOINT -> http://localhost:3210/api/users
userRouter.get("/users", listUser)

export default userRouter