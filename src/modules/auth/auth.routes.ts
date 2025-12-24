import { NextFunction, Request, Response, Router } from "express";
import { authLimiter } from "../../middlewares/rateLimiter.middleware";
import { AuthController } from "./auth.controller";
import { authenticate } from "./auth.middleware";
import { loginValidation, registerValidation } from "./auth.validation";

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  authLimiter,
  registerValidation,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next)
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  authLimiter,
  loginValidation,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next)
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get(
  "/me",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    authController.getCurrentUser(req, res, next)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear cookie)
 * @access  Public
 */
router.post("/logout", (req: Request, res: Response, next: NextFunction) =>
  authController.logout(req, res, next)
);

export default router;
