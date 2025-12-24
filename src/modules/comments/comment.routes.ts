import { NextFunction, Request, Response, Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { CommentController } from "./comment.controller";
import {
  commentIdValidation,
  createCommentValidation,
  getCommentsValidation,
  updateCommentValidation,
} from "./comment.validation";

const router = Router();
const commentController = new CommentController();

/**
 * @route   GET /api/comments
 * @desc    Get all comments with pagination and sorting
 * @access  Public
 * @query   page, limit, sort, parentComment
 */
router.get(
  "/",
  getCommentsValidation,
  (req: Request, res: Response, next: NextFunction) =>
    commentController.getComments(req, res, next)
);

/**
 * @route   GET /api/comments/:id
 * @desc    Get a single comment by ID
 * @access  Public
 */
router.get(
  "/:id",
  commentIdValidation,
  (req: Request, res: Response, next: NextFunction) =>
    commentController.getComment(req, res, next)
);

/**
 * @route   POST /api/comments
 * @desc    Create a new comment
 * @access  Private
 */
router.post(
  "/",
  authenticate,
  createCommentValidation,
  (req: Request, res: Response, next: NextFunction) =>
    commentController.createComment(req, res, next)
);

/**
 * @route   PUT /api/comments/:id
 * @desc    Update a comment
 * @access  Private (author only)
 */
router.put(
  "/:id",
  authenticate,
  updateCommentValidation,
  (req: Request, res: Response, next: NextFunction) =>
    commentController.updateComment(req, res, next)
);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (author only)
 */
router.delete(
  "/:id",
  authenticate,
  commentIdValidation,
  (req: Request, res: Response, next: NextFunction) =>
    commentController.deleteComment(req, res, next)
);

/**
 * @route   POST /api/comments/:id/like
 * @desc    Like a comment (toggle)
 * @access  Private
 */
router.post(
  "/:id/like",
  authenticate,
  commentIdValidation,
  (req: Request, res: Response, next: NextFunction) =>
    commentController.likeComment(req, res, next)
);

/**
 * @route   POST /api/comments/:id/dislike
 * @desc    Dislike a comment (toggle)
 * @access  Private
 */
router.post(
  "/:id/dislike",
  authenticate,
  commentIdValidation,
  (req: Request, res: Response, next: NextFunction) =>
    commentController.dislikeComment(req, res, next)
);

/**
 * @route   GET /api/comments/:id/replies
 * @desc    Get replies for a comment
 * @access  Public
 */
router.get(
  "/:id/replies",
  commentIdValidation,
  (req: Request, res: Response, next: NextFunction) =>
    commentController.getReplies(req, res, next)
);

export default router;
