import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { JwtPayload, verifyToken } from "../../utils/jwt";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided. Please authenticate.", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Invalid token format", 401);
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Invalid or expired token", 401));
    }
  }
};
