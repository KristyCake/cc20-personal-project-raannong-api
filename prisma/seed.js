import prisma from "../src/config/prisma.js"
import bcrypt from "bcryptjs"

const hashedPassword = bcrypt.hashSync('123456', 10)
const userData = [
  {
    name: "Bam",
    password: hashedPassword,
    email: "bam@gmail.com",
    role: "user"
  },
  {
    name: "New",
    password: hashedPassword,
    email: "new@gmail.com",
    role: "user"
  },
  {
    name: "Mew",
    password: hashedPassword,
    email: "mew@gmail.com",
    role: "user"
  },
  {
    name: "Joy",
    password: hashedPassword,
    email: "joy@gmail.com",
    role: "user"
  },
  {
    name: "Sangla",
    password: hashedPassword,
    email: "sangla@gmail.com",
    role: "user"
  },
  {
    name: "Nooknick",
    password: hashedPassword,
    email: "nooknick@gmail.com",
    role: "user"
  },
  {
    name: "Kim",
    password: hashedPassword,
    email: "kim@gmail.com",
    role: "user"
  },
  {
    name: "Cake",
    password: hashedPassword,
    email: "cake-user@gmail.com",
    role: "user"
  },
  {
    name: "KristyCake",
    password: hashedPassword,
    email: "cake-admin@gmail.com",
    role: "admin"
  }
]

async function seedDB() {
  await prisma.user.createMany({ data: userData, skipDuplicates: true })
}

seedDB().then(console.log("DB Seed successful"))
  .catch(err => console.log(err))
  .finally(prisma.$disconnect())