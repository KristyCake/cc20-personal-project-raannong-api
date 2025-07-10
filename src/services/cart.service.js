import prisma from "../config/prisma.js";


export async function getCart(id) {
  const cart = await prisma.cart.findUnique({
    where: { userId: id }, include: { items: true },
    omit: { createdAt: true, updatedAt: true }
  });
  return cart
}

// เพิ่มสินค้าแบบ merge quantity
export async function addCartItem(userId, productId, quantity) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
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
      quantity: existingItem.quantity + quantity,
    },
  });
  return updated;
}


export async function deleteCartItem(cartItemId) {
  const deleteItem = await prisma.cartItem.delete({
    where: { id: cartItemId }
  });
  return deleteItem
}
