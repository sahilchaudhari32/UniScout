import { Router } from "express";
import { asyncHandler } from "../utils/api.js";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  create,
  getOne,
  list,
  nearby,
  remove,
  update,
} from "../controllers/colleges.js";
const router = Router();
router.get("/nearby", asyncHandler(nearby));
router.get("/", asyncHandler(list));
router.get("/:id", authenticate, asyncHandler(getOne));
router.post("/", authenticate, authorize("ADMIN"), asyncHandler(create));
router.patch("/:id", authenticate, authorize("ADMIN"), asyncHandler(update));
router.delete("/:id", authenticate, authorize("ADMIN"), asyncHandler(remove));
export default router;
