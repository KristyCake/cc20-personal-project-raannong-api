import jwt from "jsonwebtoken"
import createError from "./create.error.js";

export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });
    console.log("JWT_SECRET at verify:", process.env.JWT_SECRET);
    console.log("Decoded payload:", payload);

    return payload;
  } catch (err) {
    return null;
  }
}

export function signToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15d"

  });
  console.log("JWT_SECRET at sign:", process.env.JWT_SECRET);
  return token
}

export function signResetToken(userId) {
  console.log({ userId })
  const payload = jwt.sign({ userId }, process.env.RESET_SECRET, {
    algorithm: "HS256",
    expiresIn: "15d"
  });
  return payload
}

export function verifyResetToken(token) {
  try {
    const payload = jwt.verify(token, process.env.RESET_SECRET, {
      algorithms: ["HS256"]
    });
    return payload.userId;
  } catch (err) {
    throw createError(400, "Invalid or expired reset token");
  }
}