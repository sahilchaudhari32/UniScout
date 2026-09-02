import College from "../models/College.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { ok } from "../utils/api.js";

export async function recommendations(req, res) {
  const user = await User.findById(req.user._id).lean();
  const preferences = user.preferences || {};
  const clauses = [];
  if (preferences.city) clauses.push({ city: new RegExp(preferences.city, "i") });
  if (preferences.state) clauses.push({ state: new RegExp(preferences.state, "i") });
  if (preferences.courses?.length) clauses.push({ courses: { $in: preferences.courses } });
  if (preferences.collegeType) clauses.push({ type: new RegExp(preferences.collegeType, "i") });
  const items = await College.find(clauses.length ? { $and: clauses } : { verified: true })
    .sort({ rating: -1, verified: -1 }).limit(20);
  return ok(res, { items, count: items.length });
}

export async function listNotifications(req, res) {
  let items = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  if (!items.length) {
    const user = await User.findById(req.user._id).lean();
    const preferences = user.preferences || {};
    const clauses = [];
    if (preferences.city) clauses.push({ city: new RegExp(preferences.city, "i") });
    if (preferences.courses?.length) clauses.push({ courses: { $in: preferences.courses } });
    const matches = await College.find(clauses.length ? { $and: clauses } : { verified: true }).sort({ rating: -1 }).limit(5);
    if (matches.length) {
      const notification = await Notification.create({ userId: req.user._id, title: "New college suggestions", message: `${matches.length} colleges match your interests.`, collegeIds: matches.map((college) => college._id) });
      items = [notification];
    }
  }
  return ok(res, { items });
}

export async function markRead(req, res) {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { readAt: new Date() },
    { new: true },
  );
  return ok(res, { notification });
}
