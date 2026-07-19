import express from "express";
import {
  createApplication,
  getMyApplications,
} from "../controllers/applicationController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

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

export default router;