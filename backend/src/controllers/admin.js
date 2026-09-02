import User from "../models/User.js";
import College from "../models/College.js";
import CampusMedia from "../models/CampusMedia.js";
import { AppError, ok, pagination } from "../utils/api.js";
export async function users(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1),
    limit = Math.min(Number(req.query.limit) || 20, 50),
    [items, total] = await Promise.all([
      User.find()
        .select("-passwordHash")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);
  return ok(res, { items, pagination: pagination(page, limit, total) });
}
export async function colleges(req, res) {
  const items = await College.find().sort({ createdAt: -1 });
  return ok(res, { items });
}
export async function moderate(req, res) {
  const status = req.params.action === "approve" ? "APPROVED" : "REJECTED";
  const media = await CampusMedia.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!media) throw new AppError("Media not found", 404, "NOT_FOUND");
  return ok(res, { media }, `Media ${status.toLowerCase()}`);
}
export async function verifyCollege(req, res) {
  const college = await College.findByIdAndUpdate(
    req.params.id,
    { verified: true },
    { new: true },
  );
  if (!college) throw new AppError("College not found", 404, "NOT_FOUND");
  return ok(res, { college }, "College verified");
}
