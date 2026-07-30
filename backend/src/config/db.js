import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DB_HOST);

export const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});