import { createUser, findUserByEmail, getMe, updateUserPassword, verifyUser } from "../services/auth.service.js";
import { signResetToken, signToken, verifyResetToken } from "../utils/jwt.js";


export async function register(req, res) {
  const { email, name, password } = req.body
  const user = await createUser(email, name, password);
  res.status(201).json({ id: user.id, name: user.name, email: user.email })
}

export async function login(req, res) {
  const { email, password } = req.body
  const user = await verifyUser(email, password);
  console.log(user)
  const payload = { id: user.id, role: user.role }
  const accessToken = signToken(payload)
  // console.log(accessToken)
  res.status(201).json({ message: `Hello ${user.name}`, role: user.role, accessToken })
}

export async function me(req, res) {
  const userId = req.userId;
  const user = await getMe(userId);
  res.json({ id: user.id, email: user.email, role: (user.role) })
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ message: "ยังไม่มี User" })
  console.log("user.id ->", user.id)
  const token = signResetToken(user.id);
  console.log("Token->", token);

  const urlLink = "http://localhost:3210/auth/reset-password";
  const link = `${urlLink}/${token}`

  res.json({ message: "Reset password link", link })
}

export async function resetPassword(req, res) {
  const token = req.params.token;
  const { password } = req.body;
  try {
    console.log("token", token)
    const payload = verifyResetToken(token);
    console.log(payload)
    const userId = payload.userId;
    const user = await updateUserPassword(userId, password)
    res.json({
      message: "password reset successful",
      user: { id: user.id, email: user.email }
    })
  } catch (error) {
    next(error)
  }
}