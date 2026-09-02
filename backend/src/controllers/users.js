import User from "../models/User.js";
import { ok } from "../utils/api.js";
import { publicUser } from "../utils/auth.js";
export async function profile(req, res) {
  const user = await User.findById(req.user._id).populate("recentlyViewed");
  return ok(res, {
    user: publicUser(user),
    recentlyViewed: user.recentlyViewed,
  });
}
export async function update(req, res) {
  const allowed = {};
  for (const key of ["name", "avatar", "preferences"])
    if (req.body[key] !== undefined) allowed[key] = req.body[key];
  const user = await User.findByIdAndUpdate(req.user._id, allowed, {
    new: true,
    runValidators: true,
  });
  return ok(res, { user: publicUser(user) }, "Profile updated");
}
