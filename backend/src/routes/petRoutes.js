import express from "express";
import {
  getAllPets,
  createPet,
  getMyPets,
  deletePet,
} from "../controllers/petController.js";

import { requireAuth } from "../middleware/authMiddleware.js";
import { requireShelterStaff } from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET /pets
router.get("/", requireAuth, getAllPets);

router.get(
  "/mine",
  requireAuth,
  requireShelterStaff,
  getMyPets
);

// POST /pets
router.post("/", requireAuth, requireShelterStaff, createPet);

router.delete(
  "/:id",
  requireAuth,
  requireShelterStaff,
  deletePet
);

export default router;