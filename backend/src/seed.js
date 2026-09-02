import { connectDatabase, closeDatabase } from "./config/db.js";
import College from "./models/College.js";
const colleges = [
  {
    name: "Ashoka University",
    shortName: "Ashoka",
    description:
      "A multidisciplinary university creating curious and engaged citizens through a world-class liberal arts education.",
    type: "Private University",
    establishedYear: 2014,
    university: "Ashoka University",
    address: "Rajiv Gandhi Education City, Sonipat",
    city: "Sonipat",
    state: "Haryana",
    country: "India",
    coordinates: { type: "Point", coordinates: [77.0967, 28.8704] },
    phone: "+91 130 230 0000",
    email: "admissions@ashoka.edu.in",
    website: "https://www.ashoka.edu.in",
    courses: ["Liberal Arts", "Sciences", "Economics"],
    facilities: ["Library", "Innovation Lab", "Sports Complex"],
    admissionInfo:
      "Applications are accepted through the university admissions portal.",
    images: [
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=85",
    ],
    verified: true,
  },
  {
    name: "Manipal Institute of Technology",
    shortName: "MIT Manipal",
    description:
      "A vibrant innovation-led campus known for engineering excellence and a global student community.",
    type: "Engineering Institute",
    establishedYear: 1957,
    university: "Manipal Academy of Higher Education",
    address: "Manipal, Udupi District",
    city: "Manipal",
    state: "Karnataka",
    country: "India",
    coordinates: { type: "Point", coordinates: [74.7869, 13.3524] },
    phone: "+91 820 292 0000",
    email: "admissions.mit@manipal.edu",
    website: "https://manipal.edu/mit.html",
    courses: ["Engineering", "Technology", "Architecture"],
    facilities: ["Maker Space", "Hostels", "Research Centre"],
    admissionInfo:
      "Admissions are based on entrance examination and academic merit.",
    images: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=85",
    ],
    verified: true,
  },
  {
    name: "Christ University",
    shortName: "CHRIST",
    description:
      "A diverse academic community with rigorous programmes, beautiful campuses and a strong culture of service.",
    type: "Deemed University",
    establishedYear: 2008,
    university: "CHRIST (Deemed to be University)",
    address: "Hosur Road, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    coordinates: { type: "Point", coordinates: [77.5946, 12.9345] },
    phone: "+91 804 012 9100",
    email: "admission@christuniversity.in",
    website: "https://christuniversity.in",
    courses: ["Business", "Law", "Media"],
    facilities: ["Central Library", "Auditorium", "Cafeteria"],
    admissionInfo:
      "Programme-specific applications and entrance tests are available on the admissions portal.",
    images: [
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=900&q=85",
    ],
    verified: true,
  },
];
await connectDatabase();
await College.deleteMany({});
await College.insertMany(colleges);
console.log(`Seeded ${colleges.length} colleges`);
await closeDatabase();
