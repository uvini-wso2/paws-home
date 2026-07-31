import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let connection = null;

export const getDB = async () => {
  if (connection) return connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ DB connected");
    return connection;
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    return null;
  }
};