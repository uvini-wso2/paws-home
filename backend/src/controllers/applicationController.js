import { getDB } from "../config/db.js";

// ✅ CREATE APPLICATION
export const createApplication = async (req, res) => {
  try {
    const { petId } = req.body;

    // ✅ Use email consistently
    const userEmail = req.user?.email || req.user?.sub;

    if (!userEmail) {
      return res.status(400).json({
        message: "User email not found in token"
      });
    }

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    // ✅ Check if already applied
    const [existing] = await db.execute(
      "SELECT * FROM applications WHERE petId = ? AND userEmail = ?",
      [petId, userEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "You have already applied for this pet"
      });
    }

    // ✅ Insert application
    await db.execute(
      "INSERT INTO applications (petId, userEmail, status) VALUES (?, ?, ?)",
      [petId, userEmail, "Pending"]
    );

    res.json({ message: "Application submitted" });

  } catch (err) {
    console.error("❌ Create application error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET MY APPLICATIONS
export const getMyApplications = async (req, res) => {
  try {
    const userEmail = req.user?.email || req.user?.sub;

    if (!userEmail) {
      return res.status(400).json({
        message: "User email not found in token"
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
      WHERE a.userEmail = ?
    `, [userEmail]);

    res.json(rows);

  } catch (err) {
    console.error("❌ Get applications error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ UPDATE APPLICATION STATUS (ADMIN)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    // ✅ Update status
    await db.execute(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, id]
    );

    // ✅ If approved → update pet
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
    console.error("❌ Update status error:", err);
    res.status(500).json({ message: err.message });
  }
};