import Review from "../models/Review.js";
import College from "../models/College.js";
import { AppError, ok } from "../utils/api.js";
export async function list(req, res) {
  const reviews = await Review.find({
    collegeId: req.params.collegeId,
    status: "APPROVED",
  })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 });
  return ok(res, { items: reviews });
}
export async function create(req, res) {
  const { collegeId, rating, title, comment } = req.body;
  if (!(await College.exists({ _id: collegeId })))
    throw new AppError("College not found", 404, "NOT_FOUND");
  if (
    !Number.isInteger(Number(rating)) ||
    Number(rating) < 1 ||
    Number(rating) > 5
  )
    throw new AppError(
      "Rating must be between 1 and 5",
      422,
      "VALIDATION_ERROR",
    );
  const review = await Review.create({
    collegeId,
    rating: Number(rating),
    title,
    comment,
    userId: req.user._id,
  });
  return ok(res, { review }, "Review submitted for moderation", 201);
}
export async function update(req, res) {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    {
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment,
    },
    { new: true, runValidators: true },
  );
  if (!review)
    throw new AppError(
      "Review not found or not owned by you",
      404,
      "NOT_FOUND",
    );
  return ok(res, { review }, "Review updated");
}
export async function remove(req, res) {
  const review = await Review.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!review)
    throw new AppError(
      "Review not found or not owned by you",
      404,
      "NOT_FOUND",
    );
  return ok(res, {}, "Review deleted");
}
