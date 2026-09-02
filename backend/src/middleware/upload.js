import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env.js";
const directory = path.resolve(process.cwd(), env.uploadDir);
fs.mkdirSync(directory, { recursive: true });
const storage = multer.diskStorage({
  destination: directory,
  filename: (req, file, cb) =>
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`,
    ),
});
const allowed = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
];
export const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSize },
  fileFilter: (req, file, cb) =>
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPEG, PNG, WEBP, MP4 and MOV files are allowed")),
});
