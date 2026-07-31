import { applications } from "../data/applications.js";
import pets  from "../data/pets.js";
import { addAuditLog } from "../services/auditService.js";
import { getDB } from "../config/db.js";

export const createApplication = async (req, res) => {
  try {
    const { petId } = req.body;
    const userEmail = req.user.email || req.user.sub;

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    const [existing] = await db.execute(
      "SELECT * FROM applications WHERE petId = ? AND userEmail = ?",
      [petId, userEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "You have already applied for this pet"
      });
    }

    await db.execute(
      "INSERT INTO applications (petId, userEmail, status) VALUES (?, ?, ?)",
      [petId, userEmail, "Pending"]
    );

    res.json({ message: "Application submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const userEmail = req.user.email || req.user.sub;

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    const [rows] = await db.execute(`
      SELECT 
        a.id AS applicationId,
        a.status,
        a.createdAt,
        p.name,
        p.species,
        p.breed,
        p.age
      FROM applications a
      JOIN pets p ON a.petId = p.id
      WHERE a.userEmail = ?
    `, [userEmail]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    // 1. Update application status
    await db.execute(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, id]
    );

    // 2. If approved → mark pet as unavailable
    if (status === "Approved") {
      const [rows] = await db.execute(
        "SELECT petId FROM applications WHERE id = ?",
        [id]
      );

      const petId = rows[0].petId;

      const db = await getDB();

      if (!db) {
        return res.status(500).json({ message: "DB not connected" });
      }

      await db.execute(
        "UPDATE pets SET status = 'Unavailable' WHERE id = ?",
        [petId]
      );
    }

    res.json({ message: "Updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
