import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import { config } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { generalLimiter } from "./middlewares/rateLimiter.middleware";
import authRoutes from "./modules/auth/auth.routes";
import commentRoutes from "./modules/comments/comment.routes";

const app: Application = express();

// Trust proxy - Required for CapRover/nginx reverse proxy
app.set("trust proxy", 1);

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

// Cookie Parser Middleware
app.use(cookieParser());

// Health Check Routes (before rate limiting)
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Comment System API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Apply general rate limiting to all routes
app.use(generalLimiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

// Handle 404 routes
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
