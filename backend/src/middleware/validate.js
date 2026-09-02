import { AppError } from "../utils/api.js";
export const validate = (schema) => (req, res, next) => {
  const result = schema(req);
  if (result.length)
    return next(new AppError(result.join(", "), 422, "VALIDATION_ERROR"));
  next();
};
export const required = (value, label) =>
  value === undefined || value === null || value === ""
    ? `${label} is required`
    : null;
export const isId = (value, label = "ID") =>
  /^[a-f\d]{24}$/i.test(value || "") ? null : `${label} is invalid`;
