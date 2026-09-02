import { colleges as localColleges, College } from "./data";
import * as SecureStore from "expo-secure-store";

export const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000/api";

export async function apiRequest<T = any>(path: string, options: {
  method?: string; body?: unknown; token?: string;
} = {}): Promise<T> {
  const token = options.token || await SecureStore.getItemAsync("uniscout.auth.token");
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status})`);
  return payload.data;
}

export async function uploadMedia(uri: string, collegeId: string, token: string, caption = "") {
  const form = new FormData();
  form.append("collegeId", collegeId);
  form.append("caption", caption);
  form.append("file", { uri, name: "campus-" + Date.now() + ".jpg", type: "image/jpeg" } as any);
  const response = await fetch(apiBaseUrl + "/media", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: form,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Upload failed");
  return payload.data;
}

type ApiCollege = {
  _id?: string;
  externalId?: string;
  name: string;
  city: string;
  state: string;
  type?: string;
  description?: string;
  images?: string[];
  courses?: string[];
  verified?: boolean;
  coordinates?: {
    coordinates?: [number, number];
  };
};

type CollegesResponse = {
  data?: {
    items?: ApiCollege[];
    pagination?: {
      hasNextPage: boolean;
    };
  };
};

export function normalizeCollege(item: ApiCollege): College {
  const [longitude, latitude] = item.coordinates?.coordinates || [
    77.209, 28.6139,
  ];

  return {
    id: item.externalId || item._id || item.name,
    backendId: item._id,
    name: item.name,
    city: item.city,
    state: item.state,
    type: item.type || "College or University",
    rating: 0,
    distance: "Nearby",
    image:
      item.images?.[0] ||
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=85",
    courses: item.courses || [],
    verified: item.verified || false,
    description:
      item.description ||
      `${item.name} is a higher education institution in ${item.city}, ${item.state}.`,
    coordinates: {
      latitude,
      longitude,
    },
  };
}

export async function fetchCollege(id: string): Promise<College> {
  const payload = await apiRequest<{ college: ApiCollege }>("/colleges/" + encodeURIComponent(id));
  return normalizeCollege(payload.college);
}

export async function searchColleges(params: Record<string, string | number | boolean | undefined>) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  const payload = await apiRequest<{ items: ApiCollege[]; pagination: { hasNextPage: boolean } }>(`/colleges?${query}`);
  return { items: (payload.items || []).map(normalizeCollege), hasNextPage: payload.pagination?.hasNextPage || false };
}

export async function fetchNearby(latitude: number, longitude: number, radius = 50000) {
  const payload = await apiRequest<{ items: ApiCollege[] }>(`/colleges/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
  return (payload.items || []).map(normalizeCollege);
}

export async function fetchAllColleges(): Promise<College[]> {
  const colleges: College[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(
      `${apiBaseUrl}/colleges?page=${page}&limit=50&sort=name`,
    );

    if (!response.ok) {
      throw new Error(`College request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as CollegesResponse;
    const items = payload.data?.items || [];

    colleges.push(...items.map(normalizeCollege));
    hasNextPage = payload.data?.pagination?.hasNextPage || false;
    page += 1;
  }

  return colleges;
}

export async function fetchCollegesWithFallback(): Promise<College[]> {
  try {
    const colleges = await fetchAllColleges();
    return colleges.length > 0 ? colleges : localColleges;
  } catch {
    return localColleges;
  }
}
