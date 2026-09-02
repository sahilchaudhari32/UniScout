# UniScout API

Production-oriented REST API for the UniScout mobile application.

## Stack

Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer, Helmet, CORS and rate limiting.

## Setup

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Use Node.js 20 or newer. Put the MongoDB connection string in `MONGODB_URI`; never commit `.env`.

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

## Authentication

Register or login to receive a JWT. Send it on protected requests:

```http
Authorization: Bearer <JWT>
```

The JWT contains only the user id and role. Password hashes are never returned.

## Endpoints

| Area | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PATCH /api/auth/profile` |
| Colleges | `GET /api/colleges`, `GET /api/colleges/:id`, admin `POST/PATCH/DELETE /api/colleges` |
| Nearby | `GET /api/colleges/nearby?latitude=12.97&longitude=77.59&radius=50000` |
| Favorites | `GET /api/favorites`, `POST /api/favorites/:collegeId`, `DELETE /api/favorites/:collegeId` |
| Reviews | `GET /api/reviews/:collegeId`, `POST /api/reviews`, `PATCH/DELETE /api/reviews/:id` |
| Media | `GET /api/media/:collegeId`, `POST /api/media`, `PATCH/DELETE /api/media/:id` |
| Profile | `GET/PATCH /api/users/profile` |
| Admin | `GET /api/admin/users`, `GET /api/admin/colleges`, moderation and verification routes |

College listing supports `page`, `limit`, `search`, `city`, `state`, `type`, `course`, `facility`, `verified`, and `sort`. Limits are capped at 50.

## Media upload

Send `multipart/form-data` to `POST /api/media` with:

- `file`: JPEG, PNG, WEBP, MP4, or MOV
- `collegeId`: MongoDB college id
- `caption`: optional caption

Files are stored behind a small local-storage abstraction at `/uploads`. The media controller stores metadata and can later be switched to S3, Cloudinary, or another provider without changing the API contract. Maximum size is controlled by `MAX_FILE_SIZE_MB`.

## Response format

Success responses use `{ success: true, message, data }`. Errors use `{ success: false, message, error }`. Validation errors return 422, unauthenticated requests 401, forbidden requests 403, missing resources 404, duplicates 409, and server failures 500.

## Admin

For local testing, create a user, then set its `role` to `ADMIN` in MongoDB. Admin-only routes are protected by both JWT authentication and role authorization.

## React Native integration

Use the API base URL reachable from the device or emulator, not `localhost` from an Android device. Store the JWT in secure storage and attach it to every protected request. For Android emulator development, the host machine is commonly `http://10.0.2.2:5000`.
