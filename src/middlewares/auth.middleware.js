import createError from "../utils/create.error.js";
import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createError(401, "Missing Authorization Header"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token); // อาจโยน error ได้
    if (!payload?.id || !payload?.role) {
      return next(createError(401, "Invalid Payload in Token"));
    }

    req.user = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch (error) {
    return next(createError(401, "Invalid or Expired Token"));
  }
}

export function authUserMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== "USER") {
      return next(createError(403, "Only USER can perform this action"));
    }
    next();
  });
}

export function authAdminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== "ADMIN") {
      return next(createError(403, "Access denied: Admins only"));
    }
    next();
  });
}
