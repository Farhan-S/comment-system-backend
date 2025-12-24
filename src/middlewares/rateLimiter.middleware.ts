import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

/**
 * Custom error handler for rate limit responses
 */
const rateLimitHandler = (_req: Request, res: Response): void => {
  res.status(429).json({
    status: "error",
    message: "Too many requests, please try again later.",
  });
};

/**
 * General API rate limiter
 * Applies to all routes
 * 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: rateLimitHandler,
});

/**
 * Strict rate limiter for authentication routes
 * Prevents brute force attacks
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 5 login/register requests per windowMs
  message:
    "Too many authentication attempts, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count successful requests
  handler: rateLimitHandler,
});

/**
 * Rate limiter for comment creation
 * Prevents spam
 * 10 comments per 5 minutes per IP
 */
export const commentCreationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 comment creations per windowMs
  message: "Too many comments created, please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count failed requests
  handler: rateLimitHandler,
});

/**
 * Rate limiter for like/dislike actions
 * Prevents vote manipulation
 * 30 likes/dislikes per 5 minutes per IP
 */
export const voteLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 vote actions per windowMs
  message: "Too many vote actions, please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: rateLimitHandler,
});

/**
 * Rate limiter for update/delete operations
 * 20 operations per 10 minutes per IP
 */
export const modificationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 modifications per windowMs
  message: "Too many modification requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Strict limiter for sensitive operations
 * Password changes, account deletion, etc.
 * 3 requests per hour per IP
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per hour
  message:
    "Too many requests for this sensitive operation, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
