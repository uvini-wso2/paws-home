import express from "express";
import cors from "cors";

import petRoutes from "./routes/petRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { getDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3002;

// CORS (ONLY ONE)
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://d0dd8f3e-5dbd-4ef5-9668-68b3a1970e0e.e1-us-east-azure.choreoapps.dev"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// JSON
app.use(express.json());

// ROOT (IMPORTANT for Choreo)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// HEALTH CHECK (IMPORTANT)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// TEST
app.get("/test", (req, res) => {
  res.json({ message: "TEST WORKING" });
});

// ROUTES
app.use("/api/pets", petRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ message: "Server error" });
});

// START SERVER
const start = async () => {
  try {
    await getDB();
    console.log("DB connected");
  } catch (e) {
    console.log("DB failed:", e.message);
  }

  app.listen(PORT, () => {
    console.log("Server running on", PORT);
  });
};

start();