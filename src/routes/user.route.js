import express from "express";

const userRouter = express.Router()

//Get All user ENDPOINT -> http://localhost:3210/api/users
userRouter.get("/users")

export default userRouter