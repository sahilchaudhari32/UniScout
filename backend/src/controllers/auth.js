import validator from "validator";
import User from "../models/User.js";
import {
  comparePassword,
  hashPassword,
  publicUser,
  signToken,
} from "../utils/auth.js";
import { AppError, ok } from "../utils/api.js";
export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || name.trim().length < 2)
    throw new AppError(
      "Name must be at least 2 characters",
      422,
      "VALIDATION_ERROR",
    );
  if (!validator.isEmail(email || ""))
    throw new AppError("A valid email is required", 422, "VALIDATION_ERROR");
  if (!password || password.length < 8)
    throw new AppError(
      "Password must be at least 8 characters",
      422,
      "VALIDATION_ERROR",
    );
  if (await User.exists({ email: email.toLowerCase() }))
    throw new AppError("Email is already registered", 409, "EMAIL_EXISTS");
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
  });
  return ok(
    res,
    { user: publicUser(user), token: signToken(user) },
    "Registration successful",
    201,
  );
}
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: (email || "").toLowerCase(),
  }).select("+passwordHash");
  if (!user || !(await comparePassword(password || "", user.passwordHash)))
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  return ok(
    res,
    { user: publicUser(user), token: signToken(user) },
    "Login successful",
  );
}
export async function me(req, res) {
  return ok(res, { user: publicUser(req.user) });
}
export async function updateProfile(req, res) {
  const allowed = {};
  for (const key of ["name", "avatar", "preferences"])
    if (req.body[key] !== undefined) allowed[key] = req.body[key];
  const user = await User.findByIdAndUpdate(req.user._id, allowed, {
    new: true,
    runValidators: true,
  });
  return ok(res, { user: publicUser(user) }, "Profile updated");
}
