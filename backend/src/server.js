import express from "express";
import cors from "cors";
import petRoutes from "./routes/petRoutes.js";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is Running!");
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Paws Home Backend Running!",
  });
});

app.use("/pets", petRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});