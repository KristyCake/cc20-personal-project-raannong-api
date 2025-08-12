import { findFilteredProducts, findProductById } from "../services/product.service.js";

export async function getFilteredProducts(req, res) {
  const { category, minPrice, maxPrice, sort } = req.query;

  const filters = {
    category: category?.toUpperCase(),
    minPrice: parseFloat(minPrice),
    maxPrice: parseFloat(maxPrice),
    sort,
  };

  const products = await findFilteredProducts(filters);
  res.json(products);
}

export async function getProductById(req, res) {
  const id = +req.params.id;
  const product = await findProductById(id);
  if (!product) return res.status(404).json({ msg: "Product not found" });
  res.json(product);
}