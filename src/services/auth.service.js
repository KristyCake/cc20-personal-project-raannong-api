import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import createError from "../utils/create.error.js";

export async function createUser(email, name, password) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw createError(400, "This email is already in use");

  const hash = await bcrypt.hash(password, 10);
  const result = await prisma.user.create({
    data: { email, name, password: hash },
  });
  return result;
}

export async function verifyUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw createError(401, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, "Incorrect password");

  return user;
}

export async function getMe(id) {
  if (!id) throw createError(400, "Missing user ID");
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw createError(404, "User not found");

  return user;
}

export async function findUserByEmail(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
}

export async function updateUserPassword(id, newPassword) {
  const hash = await bcrypt.hash(newPassword, 10);
  return await prisma.user.update({
    where: { id },
    data: { password: hash },
  });
}
