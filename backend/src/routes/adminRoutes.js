import express from "express";

import {
  getUsers,
  getAuditActivity,
} from "../controllers/adminController.js";

import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

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
  getAuditActivity
);

export default router;