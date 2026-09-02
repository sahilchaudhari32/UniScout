import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    externalId: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    shortName: { type: String, trim: true, index: true },
    description: { type: String, required: true },
    type: { type: String, required: true, index: true },
    establishedYear: Number,
    university: String,
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    country: { type: String, default: "India" },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    phone: String,
    email: String,
    website: String,
    courses: [{ type: String, index: true }],
    facilities: [{ type: String, index: true }],
    admissionInfo: String,
    images: [String],
    verified: { type: Boolean, default: false, index: true },
    rating: { type: Number, min: 0, max: 5, default: 0, index: true },
  },
  { timestamps: true },
);
schema.index({ coordinates: "2dsphere" });
schema.index({
  name: "text",
  shortName: "text",
  city: "text",
  state: "text",
  courses: "text",
});
export default mongoose.model("College", schema);
