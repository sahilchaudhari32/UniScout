import "dotenv/config";

const required = ["MONGODB_URI", "JWT_SECRET"];
for (const key of required)
  if (!process.env[key]) throw new Error(`${key} is required`);
export const env = {
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:8081",
  nodeEnv: process.env.NODE_ENV || "development",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  maxFileSize: Number(process.env.MAX_FILE_SIZE_MB || 50) * 1024 * 1024,
  collegeDbBaseUrl:
    process.env.COLLEGE_DB_BASE_URL || "https://api.collegedb.in",
  collegeDbApiKey: process.env.COLLEGE_DB_API_KEY || "",
  collegeDataFile: process.env.COLLEGE_DATA_FILE || "./data/uniscout_colleges_1000.json",
};
