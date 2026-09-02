import path from "path";
import CampusMedia from "../models/CampusMedia.js";
import College from "../models/College.js";
import { AppError, ok } from "../utils/api.js";
export async function create(req, res) {
  if (!req.file)
    throw new AppError("A media file is required", 422, "FILE_REQUIRED");
  const collegeId = req.body.collegeId;
  if (!(await College.exists({ _id: collegeId })))
    throw new AppError("College not found", 404, "NOT_FOUND");
  const type = req.file.mimetype.startsWith("video/") ? "VIDEO" : "IMAGE";
  const media = await CampusMedia.create({
    collegeId,
    uploadedBy: req.user._id,
    type,
    url: `/uploads/${path.basename(req.file.path)}`,
    caption: req.body.caption,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });
  return ok(res, { media }, "Media uploaded and pending moderation", 201);
}
export async function list(req, res) {
  const items = await CampusMedia.find({
    collegeId: req.params.collegeId,
    status: "APPROVED",
  })
    .populate("uploadedBy", "name avatar")
    .sort({ createdAt: -1 });
  return ok(res, { items });
}
export async function update(req, res) {
  const media = await CampusMedia.findOneAndUpdate(
    { _id: req.params.id, uploadedBy: req.user._id },
    { caption: req.body.caption },
    { new: true, runValidators: true },
  );
  if (!media)
    throw new AppError("Media not found or not owned by you", 404, "NOT_FOUND");
  return ok(res, { media }, "Media updated");
}
export async function remove(req, res) {
  const media = await CampusMedia.findOneAndDelete({
    _id: req.params.id,
    uploadedBy: req.user._id,
  });
  if (!media)
    throw new AppError("Media not found or not owned by you", 404, "NOT_FOUND");
  return ok(res, {}, "Media deleted");
}
