import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { closeDatabase, connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import College from "./models/College.js";

function toCollegeDocument(record) {
  const location = record.location || {};
  const contact = record.contact || {};
  const images = [record.coverImage, ...(record.gallery || [])].filter(Boolean);
  return {
    externalId: record.id,
    name: record.name,
    shortName: record.shortName,
    description: record.description || `${record.name} is a higher education institution.`,
    type: record.type || "College or University",
    establishedYear: record.establishedYear,
    address: location.address || `${location.city || ""}, ${location.state || ""}`,
    city: location.city || "Unknown",
    state: location.state || "Unknown",
    country: location.country || record.country || "India",
    coordinates: { type: "Point", coordinates: location.coordinates || [77.209, 28.6139] },
    phone: contact.phone,
    email: contact.email,
    website: contact.website,
    courses: record.courses || [],
    facilities: record.facilities || [],
    admissionInfo: record.admissionInfo ? JSON.stringify(record.admissionInfo) : "",
    images,
    rating: Number(record.rating) || 0,
    verified: Boolean(record.verified),
  };
}

const sourcePath = path.resolve(process.cwd(), env.collegeDataFile);
const source = JSON.parse(await fs.readFile(sourcePath, "utf8"));
const records = Array.isArray(source) ? source : source.colleges;
if (!Array.isArray(records) || records.length === 0) throw new Error("Dataset must contain a non-empty colleges array");

await connectDatabase();
try {
  const operations = records.map((record) => ({
    updateOne: {
      filter: { externalId: record.id },
      update: { $set: toCollegeDocument(record) },
      upsert: true,
    },
  }));
  const result = await College.bulkWrite(operations, { ordered: false });
  console.log(`Imported ${records.length} dataset colleges (${result.upsertedCount} new, ${result.modifiedCount} updated)`);
} finally {
  await closeDatabase();
}
