import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.connection.on("connected", () => console.log("MongoDB connected"));
  mongoose.connection.on("error", (error) =>
    console.error("MongoDB error:", error.message),
  );
  mongoose.connection.on("disconnected", () =>
    console.warn("MongoDB disconnected"),
  );
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
}

export async function closeDatabase() {
  await mongoose.connection.close();
}
