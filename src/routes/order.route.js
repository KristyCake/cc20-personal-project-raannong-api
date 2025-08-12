import express from "express";
import { authUserMiddleware, authAdminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus } from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/", authMiddleware, authUserMiddleware, createOrder); // USER สร้างออเดอร์
orderRouter.get("/", authMiddleware, authAdminMiddleware, getAllOrders); // ADMIN ดูทุกออเดอร์
orderRouter.get("/:id", authMiddleware, authAdminMiddleware, getOrderById); // ADMIN ดู order ตาม id
orderRouter.get("/:id", authMiddleware, authAdminMiddleware, updateOrderStatus); // ADMIN change the status


export default orderRouter