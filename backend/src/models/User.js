import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      city: String,
      courses: [String],
    },
  },
  { timestamps: true },
);
export default mongoose.model("User", schema);
