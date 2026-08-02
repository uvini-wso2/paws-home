import { getDB } from "../config/db.js";

// ✅ CREATE APPLICATION
export const createApplication = async (req, res) => {
  try {
    const { petId } = req.body;

    const userId = req.user?.sub;

    if (!userId) {
      return res.status(400).json({
        message: "User ID not found in token"
      });
    }

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    // ✅ Check duplicate
    const [existing] = await db.execute(
      "SELECT * FROM applications WHERE petId = ? AND userId = ?",
      [petId, userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "You already applied for this pet"
      });
    }

    // ✅ Insert
    await db.execute(
      "INSERT INTO applications (petId, userId, status) VALUES (?, ?, ?)",
      [petId, userId, "Pending"]
    );

    res.json({ message: "Application submitted" });

  } catch (err) {
    console.error("❌ createApplication error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET MY APPLICATIONS
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(400).json({
        message: "User ID not found in token"
      });
    }

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
      WHERE a.userId = ?
    `, [userId]);

    res.json(rows);

  } catch (err) {
    console.error("❌ getMyApplications error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ UPDATE APPLICATION STATUS
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    // ✅ Update application
    await db.execute(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, id]
    );

    // ✅ If approved → mark pet unavailable
    if (status === "Approved") {
      const [rows] = await db.execute(
        "SELECT petId FROM applications WHERE id = ?",
        [id]
      );

      if (rows.length > 0) {
        const petId = rows[0].petId;

        await db.execute(
          "UPDATE pets SET status = 'Unavailable' WHERE id = ?",
          [petId]
        );
      }
    }

    res.json({ message: "Updated successfully" });

  } catch (err) {
    console.error("❌ updateApplicationStatus error:", err);
    res.status(500).json({ message: err.message });
  }
};