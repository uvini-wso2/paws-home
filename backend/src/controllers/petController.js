import { getDB } from "../config/db.js";

// GET ALL PETS
export const getAllPets = async (req, res) => {
  try {
    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    const [rows] = await db.execute("SELECT * FROM pets");

    res.json(rows);
  } catch (err) {
    console.error("❌ getAllPets error:", err);
    res.status(500).json({ message: err.message });
  }
};


// CREATE PET
export const createPet = async (req, res) => {
  try {
    const { name, species, breed, age } = req.body;

    const userEmail = req.user?.email || req.user?.sub;

    if (!userEmail) {
      return res.status(400).json({
        message: "User not found"
      });
    }

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
    console.error("❌ createPet error:", err);
    res.status(500).json({ message: err.message });
  }
};


// GET MY PETS
export const getMyPets = async (req, res) => {
  try {
    const userEmail = req.user?.email || req.user?.sub;

    if (!userEmail) {
      return res.status(400).json({
        message: "User not found"
      });
    }

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
    console.error("❌ getMyPets error:", err);
    res.status(500).json({ message: err.message });
  }
};


// DELETE PET
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
    console.error("❌ deletePet error:", err);
    res.status(500).json({ message: err.message });
  }
};