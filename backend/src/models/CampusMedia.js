import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["IMAGE", "VIDEO"], required: true },
    url: { type: String, required: true },
    caption: { type: String, maxlength: 300 },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    mimeType: String,
    size: Number,
    width: Number,
    height: Number,
    duration: Number,
  },
  { timestamps: true },
);
schema.index({ collegeId: 1, status: 1 });
export default mongoose.model("CampusMedia", schema);
