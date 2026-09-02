import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ["RECOMMENDATION", "UPDATE"], default: "RECOMMENDATION" },
    collegeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
    readAt: Date,
  },
  { timestamps: true },
);

schema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("Notification", schema);
