import { getDB } from "../config/db.js";

/**
 * GET ALL USERS
 * Reads from users table (NOT applications)
 */
export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        email,
        role,
        status
      FROM users
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET AUDIT LOGS
 * Using applications as audit activity
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
      JOIN pets p ON a.petId = p.id
      ORDER BY a.createdAt DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ message: err.message });
  }
};