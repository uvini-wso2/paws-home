import pets from "../data/pets.js";
import { addAuditLog } from "../services/auditService.js";

import { getDB } from "../config/db.js";

export const getAllPets = async (req, res) => {
  try {

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    const [rows] = await db.execute("SELECT * FROM pets");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPet = async (req, res) => {
  console.log(req.user);

  try {
    const { name, species, breed, age } = req.body;
    const userEmail = req.user.sub;

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    await db.execute(
      "INSERT INTO pets (name, species, breed, age, status, createdBy) VALUES (?, ?, ?, ?, ?, ?)",
      [name, species, breed, age, "Available", userEmail]
    );

    res.json({ message: "Pet created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMyPets = async (req, res) => {
  try {
    const userEmail = req.user.sub;

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    const [rows] = await db.execute(
      "SELECT * FROM pets WHERE createdBy = ?",
      [userEmail]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    await db.execute("DELETE FROM pets WHERE id = ?", [id]);

    res.json({ message: "Pet deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};