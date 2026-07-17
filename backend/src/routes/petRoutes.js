import express from "express";
import { getAllPets } from "../controllers/petController.js";

const router = express.Router();

// GET /pets
router.get("/", getAllPets);

export default router;