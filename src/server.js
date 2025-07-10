import express from "express";
import cors from "cors";
import notFound from "./middlewares/not-found.js";
import error from "./middlewares/error.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";

const app = express()
const PORT = 3210;

//middlewares
app.use(cors());
app.use(express.json());

//Routing
app.use("/api", userRouter)
app.use("/auth", authRouter)
app.use("/cart", cartRouter)
app.use("/orders", orderRouter)

// 404
app.use(notFound)

//error
app.use(error)

app.listen(PORT, () => { console.log(`Server running on htttp://localhost:${PORT}`) })