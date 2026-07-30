import express from "express";

import {
  getUsers,
  getAuditLogs,
} from "../controllers/adminController.js";

import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import { updateApplicationStatus } from "../controllers/applicationController.js";

const router = express.Router();

router.get(
  "/users",
  requireAuth,
  requireAdmin,
  getUsers
);

router.get(
  "/audit",
  requireAuth,
  requireAdmin,
  getAuditLogs
);

router.put(
  "/:id/status",
  requireAuth,
  requireAdmin,
  updateApplicationStatus
);

export default router;