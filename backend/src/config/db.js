import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool = null;

export const getDB = async () => {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("✅ DB pool created");
  return pool;
};