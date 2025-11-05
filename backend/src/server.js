import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import patientRoutes from "./routes/patients.js";
import statsRoutes from "./routes/stats.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect to db
connectDB();

// middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(json());

// routes
app.use("/api/patients", patientRoutes);
app.use("/api/stats", statsRoutes);

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "PatientFlow API is running" });
});

// error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
