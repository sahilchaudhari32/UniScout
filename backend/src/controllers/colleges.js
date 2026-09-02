import College from "../models/College.js";
import User from "../models/User.js";
import { AppError, ok, pagination } from "../utils/api.js";
import mongoose from "mongoose";
export async function list(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1),
    limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50),
    {
      search,
      city,
      state,
      type,
      course,
      facility,
      verified,
      sort = "createdAt",
    } = req.query;
  const filter = {};
  if (search) filter.$text = { $search: search };
  if (city) filter.city = new RegExp(`^${city}$`, "i");
  if (state) filter.state = new RegExp(`^${state}$`, "i");
  if (type) filter.type = new RegExp(type, "i");
  if (course) filter.courses = { $regex: course, $options: "i" };
  if (facility) filter.facilities = { $regex: facility, $options: "i" };
  if (verified !== undefined) filter.verified = verified === "true";
  const sortMap = { name: 1, createdAt: -1, rating: -1 };
  const [items, total] = await Promise.all([
    College.find(filter)
      .sort(sortMap[sort] ? { [sort]: sortMap[sort] } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    College.countDocuments(filter),
  ]);
  return ok(res, { items, pagination: pagination(page, limit, total) });
}
export async function getOne(req, res) {
  const college = mongoose.isValidObjectId(req.params.id)
    ? await College.findById(req.params.id)
    : await College.findOne({ externalId: req.params.id });
  if (!college) throw new AppError("College not found", 404, "NOT_FOUND");
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { recentlyViewed: college._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { recentlyViewed: { $each: [college._id], $slice: -20 } },
    });
  }
  return ok(res, { college });
}
export async function create(req, res) {
  const college = await College.create(req.body);
  return ok(res, { college }, "College created", 201);
}
export async function update(req, res) {
  const college = await College.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!college) throw new AppError("College not found", 404, "NOT_FOUND");
  return ok(res, { college }, "College updated");
}
export async function remove(req, res) {
  const college = await College.findByIdAndDelete(req.params.id);
  if (!college) throw new AppError("College not found", 404, "NOT_FOUND");
  return ok(res, {}, "College deleted");
}
export async function nearby(req, res) {
  const latitude = Number(req.query.latitude),
    longitude = Number(req.query.longitude),
    radius = Number(req.query.radius || 50000);
  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180 ||
    !Number.isFinite(radius) ||
    radius < 1
  )
    throw new AppError(
      "Valid latitude, longitude and radius are required",
      422,
      "INVALID_COORDINATES",
    );
  const items = await College.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [longitude, latitude] },
        distanceField: "distance",
        maxDistance: radius,
        spherical: true,
        query: { verified: true },
      },
    },
    { $limit: 100 },
  ]);
  return ok(res, { items });
}
