import jwt from "jsonwebtoken"

export function verifyToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"]
  });
  return payload
}

export function signToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15d"

  });
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
  const payload = jwt.verify(token, process.env.RESET_SECRET, {
    algorithms: ["HS256"]
  });
  return payload;
}