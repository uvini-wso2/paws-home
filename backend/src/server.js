import express from "express";
import cors from "cors";

import petRoutes from "./routes/petRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { getDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3002;

// ✅ CORS (Production-safe but flexible)
app.use(
  cors({
    origin: "*", // 🔥 keep for now (safe for demo)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Parse JSON
app.use(express.json());

// ✅ TEST ROUTE (VERY IMPORTANT for debugging)
app.get("/test", (req, res) => {
  res.json({ message: "✅ Test route working" });
});

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend is Running!");
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Paws Home Backend Running!",
  });
});

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ✅ ROUTES
app.use("/api/pets", petRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// ✅ GLOBAL ERROR HANDLER (CRUCIAL FOR JSON ERRORS)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);

  res.status(500).json({
    message: "Internal server error",
  });
});

// ✅ START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    console.log("🔌 Trying DB connection...");
    await getDB();
    console.log("✅ DB connected");
  } catch (error) {
    console.error("⚠️ DB failed, but server will still run:", error.message);
  }

  // 🚀 ALWAYS START SERVER
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
};

startServer();