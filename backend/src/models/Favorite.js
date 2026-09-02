import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
schema.index({ userId: 1, collegeId: 1 }, { unique: true });
export default mongoose.model("Favorite", schema);
