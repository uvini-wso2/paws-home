import { getDB } from "../config/db.js";

/**
 * ✅ GET ALL USERS
 */
export const getUsers = async (req, res) => {
  try {
    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    const [rows] = await db.execute(`
      SELECT 
        id,
        email,
        role,
        status
      FROM users
    `);

    res.json(rows);

  } catch (err) {
    console.error("❌ Users error:", err);
    res.status(500).json({
      message: "Failed to fetch users",
      error: err.message
    });
  }
};


/**
 * ✅ GET AUDIT LOGS
 */
export const getAuditLogs = async (req, res) => {
  try {
    const db = await getDB();

    if (!db) {
      return res.status(500).json({ message: "DB not connected" });
    }

    const [rows] = await db.execute(`
      SELECT 
        a.id,
        a.userEmail,
        'Applied for adoption' AS action,
        a.status,
        a.createdAt,
        p.name AS petName,
        p.species
      FROM applications a
      LEFT JOIN pets p ON a.petId = p.id
      ORDER BY a.createdAt DESC
    `);

    res.json(rows);

  } catch (err) {
    console.error("❌ Audit error:", err);
    res.status(500).json({
      message: "Failed to fetch audit logs",
      error: err.message
    });
  }
};