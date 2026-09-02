import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const hashPassword = (password) => bcrypt.hash(password, 12);
export const comparePassword = (password, hash) =>
  bcrypt.compare(password, hash);
export const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
export const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  preferences: user.preferences,
  createdAt: user.createdAt,
});
