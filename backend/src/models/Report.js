import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["COLLEGE", "MEDIA", "REVIEW", "USER"],
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true, maxlength: 120 },
    description: { type: String, maxlength: 1000 },
    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "RESOLVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);
export default mongoose.model("Report", schema);
