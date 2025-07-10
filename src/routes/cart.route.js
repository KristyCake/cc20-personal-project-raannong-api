import express from "express"
import { cart, createCart, patchCartItem, removeCartItem } from "../controllers/cart.controller.js";
import { authMiddleware, authUserMiddleware } from "../middlewares/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.get("/", authMiddleware, authUserMiddleware, cart)
cartRouter.post("/", authMiddleware, authUserMiddleware, createCart)
cartRouter.patch("/items/:id", authMiddleware, authUserMiddleware, patchCartItem)
cartRouter.delete("/items/:id", authMiddleware, authUserMiddleware, removeCartItem)

export default cartRouter