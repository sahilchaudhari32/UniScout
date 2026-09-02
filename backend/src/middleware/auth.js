import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";
import { AppError } from "../utils/api.js";
export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      throw new AppError("Authentication required", 401, "UNAUTHENTICATED");
    const payload = jwt.verify(header.slice(7), env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user)
      throw new AppError("User no longer exists", 401, "UNAUTHENTICATED");
    req.user = user;
    next();
  } catch (error) {
    next(
      error.status
        ? error
        : new AppError("Invalid or expired token", 401, "UNAUTHENTICATED"),
    );
  }
}
export const authorize =
  (...roles) =>
  (req, res, next) =>
    roles.includes(req.user?.role)
      ? next()
      : next(
          new AppError(
            "You do not have permission for this action",
            403,
            "FORBIDDEN",
          ),
        );
