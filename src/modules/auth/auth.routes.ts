import { Router, Request, Response, NextFunction } from "express";
import { AuthController } from "./auth.controller";
import { authenticate } from "./auth.middleware";
import { registerValidation, loginValidation } from "./auth.validation";

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerValidation, (req: Request, res: Response, next: NextFunction) =>
  authController.register(req, res, next)
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", loginValidation, (req: Request, res: Response, next: NextFunction) =>
  authController.login(req, res, next)
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", authenticate, (req: Request, res: Response, next: NextFunction) =>
  authController.getCurrentUser(req, res, next)
);

export default router;
