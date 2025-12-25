import { NextFunction, Request, Response } from "express";
import { config } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Validation is handled by middleware
      const result = await authService.register({ name, email, password });

      // Set HTTP-only cookie
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: config.nodeEnv === "production", // HTTPS in production
        sameSite: config.nodeEnv === "production" ? "none" : "strict", // 'none' for cross-site in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validation is handled by middleware
      const result = await authService.login({ email, password });

      // Set HTTP-only cookie
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: config.nodeEnv === "production", // HTTPS in production
        sameSite: config.nodeEnv === "production" ? "none" : "strict", // 'none' for cross-site in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   * GET /api/auth/me
   */
  async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("User not authenticated", 401);
      }

      const user = await authService.getUserById(req.user.userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      res.status(200).json({
        status: "success",
        data: {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Clear the cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: config.nodeEnv === "production" ? "none" : "strict",
      });

      res.status(200).json({
        status: "success",
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  }
}
