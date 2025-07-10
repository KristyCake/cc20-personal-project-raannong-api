import createError from "../utils/create.error.js";
import { verifyToken } from "../utils/jwt.js";

/**
 * ✅ ฟังก์ชันกลาง ใช้ดึงข้อมูล user จาก JWT
 * - ตรวจสอบว่า header มี token หรือไม่
 * - verify token และเก็บ payload ใน req.user
 */
function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError(401, "Invalid Token"));
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return next(createError(401, "Invalid Token"));
  }

  req.user = {
    id: payload.id,
    role: payload.role,
  };

  next();
}

/**
 * ✅ ใช้สำหรับ route ที่ "ต้อง login" (ไม่สนว่าเป็น USER หรือ ADMIN)
 * ตัวอย่าง: `/me`, `/reset-password`
 */
export function authMiddleware(req, res, next) {
  authenticateUser(req, res, next);
}

/**
 * ✅ ใช้สำหรับ route ที่ "เฉพาะ USER" เท่านั้น
 * ตัวอย่าง: `/cart`, `/orders` (ของตัวเอง)
 */
export function authUserMiddleware(req, res, next) {
  authenticateUser(req, res, () => {
    if (req.user.role !== "USER") {
      return next(createError(403, "Only USER can perform this action"));
    }
    next();
  });
}

/**
 * ✅ ใช้สำหรับ route ที่ "เฉพาะ ADMIN" เท่านั้น
 * ตัวอย่าง: `/orders` (ทั้งหมด), `/products/admin-only`
 */
export function authAdminMiddleware(req, res, next) {
  authenticateUser(req, res, () => {
    if (req.user.role !== "ADMIN") {
      return next(createError(403, "Access denied: Admins only"));
    }
    next();
  });
}
