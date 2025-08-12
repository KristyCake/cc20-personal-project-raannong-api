import {
  createUser,
  findUserByEmail,
  getMe,
  updateUserPassword,
  verifyUser,
} from "../services/auth.service.js";
import createError from "../utils/create.error.js";
import { signResetToken, signToken, verifyResetToken } from "../utils/jwt.js";


export async function register(req, res, next) {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      throw createError(400, "Please fill in all required fields");
    }

    const user = await createUser(email, name, password);
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createError(400, "Incomplete information");

    const user = await verifyUser(email, password);
    const payload = { id: user.id, role: user.role };
    const accessToken = signToken(payload);

    res.json({
      message: `${user.name}`,
      role: user.role,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    // console.log("req.user =", req.user);
    const userId = req.user.id;
    const user = await getMe(userId);
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) throw createError(400, "Please enter your email");

    const user = await findUserByEmail(email);
    if (!user) throw createError(400, "User not found");

    const token = signResetToken(user.id);
    const resetLink = `http://localhost:3210/auth/reset-password/${token}`;
    res.json({ message: "Password reset link sent successfully", resetLink });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) throw createError(400, "Please enter a new password");

    const userId = verifyResetToken(token);
    await updateUserPassword(userId, password);

    res.json({ message: " Password changed successfully" });
  } catch (err) {
    next(err);
  }
}
