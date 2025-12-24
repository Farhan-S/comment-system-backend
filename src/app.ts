import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import { config } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

const app: Application = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes will be added here
// app.use('/api/auth', authRoutes);
// app.use('/api/comments', commentRoutes);

// Handle 404 routes
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
