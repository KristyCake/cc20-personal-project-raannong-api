import dotenv from "dotenv"
dotenv.config();

import express from "express";
import cors from "cors";
import notFound from "./middlewares/not-found.js";
import { handleError } from "./middlewares/error.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import productRouter from "./routes/product.route.js";

const app = express()
const PORT = 3210;

//middlewares
app.use(cors());
app.use(express.json());

//Routing
app.use("/api", userRouter)
app.use("/auth", authRouter)
app.use("/cart", cartRouter)
app.use("/order", orderRouter)
app.use("/products", productRouter)

// 404
app.use(notFound)

//error
app.use(handleError)

app.listen(PORT, () => { console.log(`Server running on htttp://localhost:${PORT}`) })