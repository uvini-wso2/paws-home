import express from "express";
import cors from "cors";

import petRoutes from "./routes/petRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { getDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3002;

// ✅ CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ JSON
app.use(express.json());

// ✅ ROUTES
app.use("/api/applications", applicationRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/admin", adminRoutes);

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend is Running!");
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Paws Home Backend Running!",
  });
});

// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong in the server",
  });
});

// ✅ START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await getDB(); // 🔥 IMPORTANT FIX

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1); // 🚨 critical for Choreo
  }
};

startServer();