import prisma from "../config/prisma.js";
import createError from "../utils/create.error.js";


export async function getCart(userId) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });
  return cart;
}



export async function addCartItem(userId, productId, quantity) {
  const cart = await prisma.cart.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: productId,
    },
  });

  if (existingItem) {
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
    return updatedItem;
  }

  const newItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
  return newItem;
}

export async function updateCartItem(cartItemId, quantity) {
  const existingItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });
  if (!existingItem) {
    throw new Error("Cart item not found");
  }
  const updated = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      quantity: quantity,
    },
  });
  return updated;
}


export async function deleteCartItem(cartItemId, userCartId) {
  const deleted = await prisma.cartItem.deleteMany({
    where: {
      id: cartItemId,
      cartId: userCartId,
    },
  });

  if (deleted.count === 0) {
    throw createError(404, "Cart item not found");
  }

  return deleted;
}