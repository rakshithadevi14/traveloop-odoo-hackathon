import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

const API_PREFIX = "/api/v1";

// API routes will be mounted here as features are added.
app.use(API_PREFIX, (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
