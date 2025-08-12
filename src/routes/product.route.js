import express from "express";
import { getFilteredProducts, getProductById } from "../controllers/product.controller.js";


const productRouter = express.Router();

productRouter.get("/", getFilteredProducts);
productRouter.get("/:id", getProductById); // /products/15

export default productRouter;
