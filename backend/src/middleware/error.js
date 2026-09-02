import mongoose from "mongoose";
import { env } from "../config/env.js";
export function notFound(req, res) {
  res
    .status(404)
    .json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`,
      error: "NOT_FOUND",
    });
}
export function errorHandler(error, req, res, next) {
  let status = error.status || 500,
    code = error.code || "INTERNAL_ERROR",
    message = error.message || "Internal server error";
  if (error instanceof mongoose.Error.ValidationError) {
    status = 422;
    code = "VALIDATION_ERROR";
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }
  if (error.code === 11000) {
    status = 409;
    code = "DUPLICATE_RESOURCE";
    message = "A resource with that value already exists";
  }
  if (error.name === "MulterError") {
    status = 422;
    code = "UPLOAD_ERROR";
  }
  console.error(
    `[${status}] ${req.method} ${req.originalUrl}: ${error.message}`,
  );
  res
    .status(status)
    .json({
      success: false,
      message,
      error: code,
      ...(env.nodeEnv === "development" ? { details: error.stack } : {}),
    });
}
