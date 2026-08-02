import express from "express";
import cors from "cors";

import petRoutes from "./routes/petRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { getDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3002;

// ✅ CORS (IMPORTANT for frontend + Choreo)
app.use(
  cors({
    origin: "*", // 🔥 for now (later restrict to frontend URL)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Parse JSON
app.use(express.json());

// ✅ Ensure DB connects at startup
getDB();

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

// ✅ GLOBAL ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong in the server",
  });
});

// ✅ START SERVER
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});