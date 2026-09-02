import { Router } from "express";
import { asyncHandler } from "../utils/api.js";
import { authenticate } from "../middleware/auth.js";
import * as c from "../controllers/users.js";
const router = Router();
router.use(authenticate);
router.get("/profile", asyncHandler(c.profile));
router.patch("/profile", asyncHandler(c.update));
export default router;
