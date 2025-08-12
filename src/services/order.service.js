import prisma from "../config/prisma.js";

export async function createOrderFromCart(userId) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  console.log("🛒 CART = ", JSON.stringify(cart, null, 2)); // 👈 จุดนี้สำคัญ

  if (!cart || cart.items.length === 0) {
    const error = new Error("Cart is empty");
    error.status = 409;
    throw error;
  }

  const validItems = cart.items.filter((item) => item.product !== null);

  if (validItems.length === 0) {
    console.warn("🚨 ไม่มีสินค้าที่ valid เหลือในตะกร้า");
    throw new Error("No valid product in cart");
  }

  console.log("✅ VALID ITEMS =", validItems);

  const totalPrice = validItems.reduce((sum, item) => {
    return sum + item.quantity * item.product.price;
  }, 0);

  console.log("💸 TOTAL PRICE =", totalPrice);

  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice,
      orderItems: {
        create: validItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return order;
}


export async function getAllOrdersService() {
  return await prisma.order.findMany({
    include: { orderItems: true },
  });
}

export async function getOrderByIdService(id) {
  return await prisma.order.findUnique({
    where: { id },
    include: { orderItems: true },
  });
}

// export async function getOrdersByUserIdService(userId) {
//   return await prisma.order.findMany({
//     where: { userId },
//     include: { orderItems: true },
//   });
// }

