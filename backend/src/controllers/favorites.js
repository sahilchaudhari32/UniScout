import Favorite from "../models/Favorite.js";
import College from "../models/College.js";
import { AppError, ok } from "../utils/api.js";
export async function list(req, res) {
  const items = await Favorite.find({ userId: req.user._id })
    .populate("collegeId")
    .sort({ createdAt: -1 });
  return ok(res, { items });
}
export async function add(req, res) {
  const college = await College.findById(req.params.collegeId);
  if (!college) throw new AppError("College not found", 404, "NOT_FOUND");
  const favorite = await Favorite.findOneAndUpdate(
    { userId: req.user._id, collegeId: college._id },
    { userId: req.user._id, collegeId: college._id },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).populate("collegeId");
  return ok(res, { favorite }, "College saved", 201);
}
export async function remove(req, res) {
  await Favorite.findOneAndDelete({
    userId: req.user._id,
    collegeId: req.params.collegeId,
  });
  return ok(res, {}, "College removed from saved");
}
