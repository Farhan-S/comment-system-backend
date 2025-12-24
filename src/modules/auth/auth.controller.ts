import { NextFunction, Request, Response } from "express";
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

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: result,
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

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: result,
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
}
