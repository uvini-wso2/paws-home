import express from "express";
import {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  createApplication
);

router.get(
  "/mine",
  requireAuth,
  getMyApplications
);

router.put(
  "/:id/status",
  requireAuth,
  requireAdmin,
  updateApplicationStatus
);

export default router;