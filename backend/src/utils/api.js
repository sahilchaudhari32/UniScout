export const ok = (res, data = {}, message = "Success", status = 200) =>
  res.status(status).json({ success: true, message, data });
export const fail = (res, message, error = "BAD_REQUEST", status = 400) =>
  res.status(status).json({ success: false, message, error });
export class AppError extends Error {
  constructor(message, status = 400, code = "BAD_REQUEST") {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
export const pagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPreviousPage: page > 1,
});
