import express from "express";
import { authUserMiddleware, authAdminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";
import { createOrder, getAllOrders, getOrderById, getOrdersByUserId } from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/", authMiddleware, authUserMiddleware, createOrder); // USER สร้างออเดอร์
orderRouter.get("/", authMiddleware, authAdminMiddleware, getAllOrders); // ADMIN ดูทุกออเดอร์
orderRouter.get("/:id", authMiddleware, authAdminMiddleware, getOrderById); // ADMIN ดู order ตาม id
orderRouter.get("/user/:userId", authMiddleware, authAdminMiddleware, getOrdersByUserId); // ADMIN ดู order ของ user คนใดคนหนึ่ง


export default orderRouter