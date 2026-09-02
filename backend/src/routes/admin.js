import { Router } from "express";
import { asyncHandler } from "../utils/api.js";
import { authenticate, authorize } from "../middleware/auth.js";
import * as c from "../controllers/admin.js";
const router = Router();
router.use(authenticate, authorize("ADMIN"));
router.get("/users", asyncHandler(c.users));
router.get("/colleges", asyncHandler(c.colleges));
router.patch(
  "/media/:id/approve",
  asyncHandler((req, res, next) => {
    req.params.action = "approve";
    return c.moderate(req, res, next);
  }),
);
router.patch(
  "/media/:id/reject",
  asyncHandler((req, res, next) => {
    req.params.action = "reject";
    return c.moderate(req, res, next);
  }),
);
router.patch("/colleges/:id/verify", asyncHandler(c.verifyCollege));
export default router;
