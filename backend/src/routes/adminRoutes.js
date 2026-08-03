import express from "express";

import {
  getUsers,
  getAuditLogs,
} from "../controllers/adminController.js";

import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import { updateApplicationStatus } from "../controllers/applicationController.js";

const router = express.Router();

// Get all users
router.get(
  "/users",
  requireAuth,
  requireAdmin,
  getUsers
);

// Get audit logs
router.get(
  "/audit",
  requireAuth,
  requireAdmin,
  getAuditLogs
);

// Update application status (ADMIN ONLY)
router.put(
  "/applications/:id/status",
  requireAuth,
  requireAdmin,
  updateApplicationStatus
);

export default router;