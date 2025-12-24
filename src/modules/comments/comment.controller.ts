import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { CommentService } from "./comment.service";

const commentService = new CommentService();

export class CommentController {
  /**
   * Get all comments with pagination and sorting
   * GET /api/comments?page=1&limit=10&sort=newest
   */
  async getComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, sort, parentComment } = req.query;

      const result = await commentService.getComments({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        sort: sort as any,
        parentComment: parentComment as string | undefined,
      });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single comment by ID
   * GET /api/comments/:id
   */
  async getComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("Comment ID is required", 400);
      }

      const comment = await commentService.getCommentById(id);

      if (!comment) {
        throw new AppError("Comment not found", 404);
      }

      res.status(200).json({
        status: "success",
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new comment
   * POST /api/comments
   */
  async createComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("User not authenticated", 401);
      }

      const { content, parentComment } = req.body;

      const comment = await commentService.createComment({
        content,
        author: req.user.userId,
        parentComment,
      });

      res.status(201).json({
        status: "success",
        message: "Comment created successfully",
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a comment
   * PUT /api/comments/:id
   */
  async updateComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("User not authenticated", 401);
      }

      const { id } = req.params;

      if (!id) {
        throw new AppError("Comment ID is required", 400);
      }

      const { content } = req.body;

      const comment = await commentService.updateComment(id, req.user.userId, {
        content,
      });

      res.status(200).json({
        status: "success",
        message: "Comment updated successfully",
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a comment
   * DELETE /api/comments/:id
   */
  async deleteComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("User not authenticated", 401);
      }

      const { id } = req.params;

      if (!id) {
        throw new AppError("Comment ID is required", 400);
      }

      await commentService.deleteComment(id, req.user.userId);

      res.status(200).json({
        status: "success",
        message: "Comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Like a comment
   * POST /api/comments/:id/like
   */
  async likeComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("User not authenticated", 401);
      }

      const { id } = req.params;

      if (!id) {
        throw new AppError("Comment ID is required", 400);
      }

      const comment = await commentService.likeComment(id, req.user.userId);

      res.status(200).json({
        status: "success",
        message: "Comment liked successfully",
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Dislike a comment
   * POST /api/comments/:id/dislike
   */
  async dislikeComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("User not authenticated", 401);
      }

      const { id } = req.params;

      if (!id) {
        throw new AppError("Comment ID is required", 400);
      }

      const comment = await commentService.dislikeComment(id, req.user.userId);

      res.status(200).json({
        status: "success",
        message: "Comment disliked successfully",
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get replies for a comment
   * GET /api/comments/:id/replies
   */
  async getReplies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("Comment ID is required", 400);
      }

      const { page, limit } = req.query;

      const result = await commentService.getReplies(
        id,
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
