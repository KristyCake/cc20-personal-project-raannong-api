import express from "express";
import cors from "cors";
import notFound from "./utils/not-found";
import error from "./utils/error";
import userRouter from "./routes/user.route";

const app = express()
const PORT = 3210;

//middlewares
app.use(cors());
app.use(express.json());

//Routing
app.use("/api", userRouter)

// 404
app.use(notFound)

//error
app.use(error)

app.listen(PORT, () => { console.log(`Server running on htttp://localhost:${PORT}`) })