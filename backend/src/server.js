import express from "express";
import cors from "cors";
import petRoutes from "./routes/petRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use(
  "/api/applications",
  applicationRoutes
);

app.use("/pets", petRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend is Running!");
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Paws Home Backend Running!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});