import express from "express";
import cors from "cors";

import petRoutes from "./routes/petRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { getDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3002;

// ✅ IMPORTANT: base path for Choreo
const BASE_PATH = process.env.BASE_PATH || "";

// ✅ CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// ✅ DEBUG ROUTE
app.get(`${BASE_PATH}/test`, (req, res) => {
  res.json({ message: "✅ Test route working" });
});

// ✅ HEALTH
app.get(`${BASE_PATH}/`, (req, res) => {
  res.send("Backend is Running!");
});

app.get(`${BASE_PATH}/api/message`, (req, res) => {
  res.json({ message: "Paws Home Backend Running!" });
});

// ✅ ROUTES
app.use(`${BASE_PATH}/api/pets`, petRoutes);
app.use(`${BASE_PATH}/api/applications`, applicationRoutes);
app.use(`${BASE_PATH}/api/admin`, adminRoutes);

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ START SERVER
const startServer = async () => {
  try {
    console.log("🔌 Connecting DB...");
    await getDB();
    console.log("✅ DB connected");
  } catch (err) {
    console.error("⚠️ DB failed:", err.message);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
};

startServer();