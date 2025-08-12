import prisma from "../config/prisma.js";

export async function findFilteredProducts({ category, minPrice, maxPrice, sort }) {
  const where = {};

  if (category) where.category = category;
  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    where.price = {};
    if (!isNaN(minPrice)) where.price.gte = minPrice;
    if (!isNaN(maxPrice)) where.price.lte = maxPrice;
  }

  let orderBy = { createdAt: "desc" }; // default

  if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  }

  return await prisma.product.findMany({
    where,
    orderBy,
  });
}

export async function findProductById(id) {
  return await prisma.product.findUnique({
    where: { id },
  });
}