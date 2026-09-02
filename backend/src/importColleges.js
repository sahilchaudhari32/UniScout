import "dotenv/config";
import { closeDatabase, connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import College from "./models/College.js";

const MAX_REQUESTS_PER_RUN = 45;
const searchTerms = [
  "engineering",
  "medical",
  "business",
  "arts",
  "science",
  "law",
  "technology",
  "management",
  "university",
  "institute",
  "college",
  "IIT",
  "NIT",
  "BITS",
  "Amity",
  "VIT",
  "SRM",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Jaipur",
  "Ahmedabad",
  "Lucknow",
  "Kochi",
  "Chandigarh",
  "Indore",
  "Bhopal",
  "Nagpur",
  "Patna",
  "Bhubaneswar",
  "Guwahati",
  "Coimbatore",
  "Mysuru",
  "Noida",
  "Gurugram",
  "Sonipat",
  "Manipal",
  "Visakhapatnam",
  "Dehradun",
  "Ranchi",
  "Varanasi",
];

const cityCoordinates = {
  Ahmedabad: [72.5714, 23.0225],
  Bengaluru: [77.5946, 12.9716],
  Bhopal: [77.4126, 23.2599],
  Bhubaneswar: [85.8245, 20.2961],
  Chandigarh: [76.7794, 30.7333],
  Chennai: [80.2707, 13.0827],
  Coimbatore: [76.9558, 11.0168],
  Dehradun: [78.0322, 30.3165],
  Delhi: [77.1025, 28.7041],
  Guwahati: [91.7362, 26.1445],
  Gurugram: [77.0266, 28.4595],
  Hyderabad: [78.4867, 17.385],
  Indore: [75.8577, 22.7196],
  Jaipur: [75.7873, 26.9124],
  Kochi: [76.2673, 9.9312],
  Kolkata: [88.3639, 22.5726],
  Lucknow: [80.9462, 26.8467],
  Manipal: [74.7869, 13.3524],
  Mumbai: [72.8777, 19.076],
  Mysuru: [76.6394, 12.2958],
  Nagpur: [79.0882, 21.1458],
  Noida: [77.391, 28.5355],
  Patna: [85.1376, 25.5941],
  Pune: [73.8567, 18.5204],
  Ranchi: [85.3096, 23.3441],
  Sonipat: [77.0967, 28.8704],
  Varanasi: [82.9739, 25.3176],
  Visakhapatnam: [83.2185, 17.6868],
};

function getCoordinates(city) {
  return cityCoordinates[city] || [77.209, 28.6139];
}

function createCollegeDocument(record) {
  const [longitude, latitude] = getCoordinates(record.city);

  return {
    externalId: record.id,
    name: record.name,
    shortName: record.name,
    description: `${record.name} is a higher education institution in ${record.city}, ${record.state}.`,
    type: "College or University",
    address: `${record.city}, ${record.state}`,
    city: record.city,
    state: record.state,
    country: "India",
    coordinates: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    courses: [],
    facilities: [],
    images: [],
    verified: false,
  };
}

async function fetchResults(query) {
  const url = new URL("/v1/colleges/search", env.collegeDbBaseUrl);
  url.searchParams.set("q", query);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.collegeDbApiKey}`,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload.error || `CollegeDB request failed (${response.status})`,
    );
  }

  return payload.results || [];
}

async function upsertColleges(records) {
  const documents = records.map(createCollegeDocument);
  const operations = documents.map((document) => ({
    updateOne: {
      filter: { externalId: document.externalId },
      update: { $set: document },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await College.bulkWrite(operations);
  }

  return documents.length;
}

async function importColleges() {
  if (!env.collegeDbApiKey) {
    throw new Error("COLLEGE_DB_API_KEY is required to import colleges");
  }

  const uniqueRecords = new Map();
  const requestLimit = Math.min(
    Number(process.env.COLLEGE_DB_IMPORT_LIMIT || MAX_REQUESTS_PER_RUN),
    searchTerms.length,
  );

  let importedCount = 0;
  for (const query of searchTerms.slice(0, requestLimit)) {
    let results;
    try {
      results = await fetchResults(query);
    } catch (error) {
      if (error.message === "Rate limit exceeded.") {
        console.warn("CollegeDB daily rate limit reached; stopping with saved progress");
        break;
      }
      throw error;
    }

    for (const result of results) {
      if (result.id && result.name && result.city && result.state) {
        uniqueRecords.set(result.id, result);
      }
    }

    importedCount += await upsertColleges(results.filter(
      (result) => result.id && result.name && result.city && result.state,
    ));

    console.log(`Fetched ${results.length} colleges for “${query}”`);
  }

  console.log(
    `Imported ${uniqueRecords.size} unique colleges from CollegeDB (${importedCount} upserts)`,
  );
  const removedSynthetic = await College.deleteMany({
    externalId: /^college-\d+$/,
  });
  console.log(`Removed ${removedSynthetic.deletedCount} synthetic dataset colleges`);
}

await connectDatabase();

try {
  await importColleges();
} finally {
  await closeDatabase();
}
