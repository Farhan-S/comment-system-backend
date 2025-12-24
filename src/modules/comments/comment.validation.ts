import { NextFunction, Request, Response } from "express";
import { body, param, query, validationResult } from "express-validator";
import { AppError } from "../../utils/AppError";

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");
    throw new AppError(errorMessages, 400);
  }

  next();
};

/**
 * Validation rules for creating a comment
 */
export const createCommentValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Comment must be between 1 and 2000 characters"),

  body("parentComment").custom((value) => {
    // Allow null, undefined, or empty string for top-level comments
    if (value === null || value === undefined || value === "") {
      return true;
    }
    // Validate as MongoDB ObjectId if value is provided
    if (typeof value === "string" && /^[a-f\d]{24}$/i.test(value)) {
      return true;
    }
    throw new Error("Invalid parent comment ID");
  }),

  handleValidationErrors,
];

/**
 * Validation rules for updating a comment
 */
export const updateCommentValidation = [
  param("id").isMongoId().withMessage("Invalid comment ID"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Comment must be between 1 and 2000 characters"),

  handleValidationErrors,
];

/**
 * Validation rules for comment ID in params
 */
export const commentIdValidation = [
  param("id").isMongoId().withMessage("Invalid comment ID"),

  handleValidationErrors,
];

/**
 * Validation rules for getting comments with query params
 */
export const getCommentsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sort")
    .optional()
    .isIn(["newest", "oldest", "mostLiked", "mostDisliked"])
    .withMessage(
      "Sort must be one of: newest, oldest, mostLiked, mostDisliked"
    ),

  query("parentComment")
    .optional()
    .custom((value) => value === "null" || /^[a-f\d]{24}$/i.test(value))
    .withMessage('Parent comment must be a valid MongoDB ID or "null"'),

  handleValidationErrors,
];
