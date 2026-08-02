import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let connection = null;

export const getDB = async () => {
  try {
    if (connection) {
      return connection;
    }

    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT,
    });

    console.log("✅ DB connected");

    return connection;

  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    return null;
  }
};