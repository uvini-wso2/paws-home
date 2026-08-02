import express from "express";
import cors from "cors";

import petRoutes from "./routes/petRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { getDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/test", (req, res) => {
  res.json({ message: "TEST WORKING" });
});

// ✅ BASIC ROUTES
app.use("/api/pets", petRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// ✅ SAFE 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ message: "Server error" });
});

// ✅ START
const start = async () => {
  try {
    await getDB();
    console.log("DB connected");
  } catch (e) {
    console.log("DB failed (still starting)");
  }

  app.listen(PORT, () => {
    console.log("Server running on", PORT);
  });
};

start();