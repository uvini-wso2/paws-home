import express from "express";
import cors from "cors";

import petRoutes from "./routes/petRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { getDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3002;

// ✅ IMPORTANT: CORS CONFIG (FIXED)
app.use(
  cors({
    origin: [
      "http://localhost:5174", // local dev
      "https://d0dd8f3e-5dbd-4ef5-9668-68b3a1970e0e.e1-us-east-azure.choreoapps.dev" 
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// HANDLE PREFLIGHT (VERY IMPORTANT)
app.options("*", cors());

// BODY PARSER
app.use(express.json());

// TEST ROUTE
app.get("/test", (req, res) => {
  res.json({ message: "TEST WORKING" });
});

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend is Running!");
});

app.get("/api/message", (req, res) => {
  res.json({ message: "Paws Home Backend Running!" });
});

// ROUTES
app.use("/api/pets", petRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// SAFE 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ message: "Server error" });
});

// START SERVER
const start = async () => {
  try {
    await getDB();
    console.log("✅ DB connected");
  } catch (e) {
    console.log("⚠️ DB failed (still starting):", e.message);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
};

start();