export type College = {
  id: string;
  backendId?: string;
  name: string;
  city: string;
  state: string;
  type: string;
  rating: number;
  distance: string;
  image: string;
  courses: string[];
  verified: boolean;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};
export const categories = [
  "Engineering",
  "Medical",
  "Business",
  "Arts",
  "Science",
  "Law",
];
export const colleges: College[] = [
  {
    id: "1",
    name: "Ashoka University",
    city: "Sonipat",
    state: "Haryana",
    type: "Private University",
    rating: 4.8,
    distance: "42 km",
    image:
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=85",
    courses: ["Liberal Arts", "Sciences"],
    verified: true,
    description:
      "A multidisciplinary university creating curious, thoughtful and engaged citizens through a world-class liberal arts education.",
    coordinates: {
      latitude: 28.9388,
      longitude: 77.1013,
    },
  },
  {
    id: "2",
    name: "Manipal Institute of Technology",
    city: "Manipal",
    state: "Karnataka",
    type: "Engineering Institute",
    rating: 4.7,
    distance: "18 km",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=85",
    courses: ["Engineering", "Technology"],
    verified: true,
    description:
      "A vibrant, innovation-led campus known for engineering excellence, industry connections and a global student community.",
    coordinates: {
      latitude: 13.3521,
      longitude: 74.7926,
    },
  },
  {
    id: "3",
    name: "Christ University",
    city: "Bengaluru",
    state: "Karnataka",
    type: "Deemed University",
    rating: 4.6,
    distance: "26 km",
    image:
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=900&q=85",
    courses: ["Business", "Law"],
    verified: true,
    description:
      "A diverse academic community with rigorous programmes, a beautiful campus and a strong culture of service.",
    coordinates: {
      latitude: 12.9345,
      longitude: 77.6068,
    },
  },
  {
    id: "4",
    name: "Indian Institute of Science",
    city: "Bengaluru",
    state: "Karnataka",
    type: "Research Institute",
    rating: 4.9,
    distance: "31 km",
    image:
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=900&q=85",
    courses: ["Science", "Research"],
    verified: true,
    description:
      "India’s premier institution for advanced scientific and technological research.",
    coordinates: {
      latitude: 13.0219,
      longitude: 77.5671,
    },
  },
];
