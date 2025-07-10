import prisma from "../config/prisma.js";

export async function createOrderFromCart(userId) {
  // 1. หา cart ของ user พร้อมสินค้าและราคาสินค้า
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true, // ← ต้อง include เพื่อให้เข้าถึง product.price ได้
        },
      },
    },
  });

  // ถ้าไม่เจอ cart หรือไม่มีสินค้า
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 2. คำนวณ totalPrice จากสินค้าใน cart
  const totalPrice = cart.items.reduce((sum, item) => {
    return sum + item.quantity * item.product.price;
  }, 0);

  // 3. สร้าง order ใหม่ พร้อม orderItems
  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice,
      orderItems: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.product.price // 👈 เพิ่มบรรทัดนี้เข้าไป
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });

  // 4. ลบ cart items เก่า (เคลียร์ตะกร้า)
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

export async function getOrdersByUserIdService(userId) {
  return await prisma.order.findMany({
    where: { userId },
    include: { orderItems: true },
  });
}

