import prisma from "../src/config/prisma.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

async function main() {

  const hashedPassword = await bcrypt.hash('123456', 10);
  const usersData = [
    { name: "Bam", email: "bam@gmail.com", role: "USER" },
    { name: "New", email: "new@gmail.com", role: "USER" },
    { name: "Mew", email: "mew@gmail.com", role: "USER" },
    { name: "Joy", email: "joy@gmail.com", role: "USER" },
    { name: "Sangla", email: "sangla@gmail.com", role: "USER" },
    { name: "Nooknick", email: "nooknick@gmail.com", role: "USER" },
    { name: "Kim", email: "kim@gmail.com", role: "USER" },
    { name: "Cake", email: "cake-user@gmail.com", role: "USER" },
    { name: "KristyCake", email: "cake-admin@gmail.com", role: "ADMIN" },
  ];

  const users = [];
  for (const userData of usersData) {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      },
    });
    users.push(user);
  }

  const products = [];
  for (let i = 0; i < 20; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.commerce.price({ min: 50, max: 500 })),
        stock: faker.number.int({ min: 5, max: 50 }),
        imageUrl: faker.image.urlPicsumPhotos(),
        category: faker.helpers.arrayElement(['CAT', 'DOG']),
      },
    });
    products.push(product);
  }

  for (const user of users) {
    if (user.role !== "USER") continue;
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
        items: {
          create: Array.from({ length: 2 }).map(() => {
            const product = faker.helpers.arrayElement(products);
            return {
              productId: product.id,
              quantity: faker.number.int({ min: 1, max: 3 }),
            };
          }),
        },
      },
      include: { items: true },
    });

    const totalPrice = cart.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    await prisma.order.create({
      data: {
        userId: user.id,
        totalPrice,
        status: faker.helpers.arrayElement(['PENDING', 'PAID', 'SHIPPED']),
        orderItems: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: products.find(p => p.id === item.productId)?.price || 0,
          })),
        },
      },
    });
  }

  console.log("✅ Seeded custom users + Faker products + carts + orders");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
