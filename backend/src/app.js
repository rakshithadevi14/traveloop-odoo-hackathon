import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const apiRouter = express.Router();
apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Traveloop API v1 is healthy",
  });
});
app.use("/api/v1", apiRouter);
app.use("/api/v1/auth", authRoutes);

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
});

export default app;
