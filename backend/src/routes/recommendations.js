import { Router } from "express";
import { asyncHandler } from "../utils/api.js";
import { authenticate } from "../middleware/auth.js";
import { listNotifications, markRead, recommendations } from "../controllers/recommendations.js";

export const recommendationRouter = Router();
recommendationRouter.use(authenticate);
recommendationRouter.get("/", asyncHandler(recommendations));

export const notificationRouter = Router();
notificationRouter.use(authenticate);
notificationRouter.get("/", asyncHandler(listNotifications));
notificationRouter.patch("/:id/read", asyncHandler(markRead));
