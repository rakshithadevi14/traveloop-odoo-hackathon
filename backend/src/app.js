<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
=======
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
>>>>>>> 928201dcb998a06d990019d2549a23f35f733379

dotenv.config();

const app = express();
<<<<<<< HEAD
const apiRouter = express.Router();

// Core middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Base v1 route
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Traveloop API v1 is healthy',
  });
});
app.use('/api/v1', apiRouter);
app.use('/api/v1/auth', authRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
});

module.exports = app;
=======

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
>>>>>>> 928201dcb998a06d990019d2549a23f35f733379
