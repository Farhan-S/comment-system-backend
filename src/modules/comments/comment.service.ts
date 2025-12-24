import { Types } from "mongoose";
import { getIO } from "../../config/socket";
import { AppError } from "../../utils/AppError";
import { Comment, IComment } from "./comment.model";

export interface CreateCommentInput {
  content: string;
  author: string;
  parentComment?: string;
}

export interface UpdateCommentInput {
  content: string;
}

export interface GetCommentsQuery {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "mostLiked" | "mostDisliked";
  parentComment?: string | null;
}

export interface PaginatedComments {
  comments: IComment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class CommentService {
  /**
   * Get all comments with pagination and sorting
   */
  async getComments(query: GetCommentsQuery): Promise<PaginatedComments> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    // Filter by parent comment (null for top-level comments)
    if (query.parentComment !== undefined) {
      filter.parentComment =
        query.parentComment === "null" ? null : query.parentComment;
    }

    // Determine sort order
    let sortOption: any = { createdAt: -1 }; // Default: newest first

    switch (query.sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "mostLiked":
        // We'll sort by array length in aggregation
        break;
      case "mostDisliked":
        // We'll sort by array length in aggregation
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // For mostLiked/mostDisliked, use aggregation
    if (query.sort === "mostLiked" || query.sort === "mostDisliked") {
      const sortField =
        query.sort === "mostLiked" ? "likesCount" : "dislikesCount";

      const aggregation = await Comment.aggregate([
        { $match: filter },
        {
          $addFields: {
            likesCount: { $size: "$likes" },
            dislikesCount: { $size: "$dislikes" },
          },
        },
        { $sort: { [sortField]: -1, createdAt: -1 } },
        {
          $facet: {
            comments: [
              { $skip: skip },
              { $limit: limit },
              {
                $lookup: {
                  from: "users",
                  localField: "author",
                  foreignField: "_id",
                  as: "authorDetails",
                },
              },
              {
                $unwind: "$authorDetails",
              },
              {
                $project: {
                  content: 1,
                  author: 1,
                  "authorDetails.name": 1,
                  "authorDetails.email": 1,
                  likes: 1,
                  dislikes: 1,
                  likesCount: 1,
                  dislikesCount: 1,
                  parentComment: 1,
                  createdAt: 1,
                  updatedAt: 1,
                },
              },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);

      const comments = aggregation[0]?.comments || [];
      const totalComments = aggregation[0]?.totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalComments / limit);

      return {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalComments,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }

    // Regular query with populate
    const [comments, totalComments] = await Promise.all([
      Comment.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("author", "name email")
        .lean(),
      Comment.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalComments / limit);

    return {
      comments: comments as unknown as IComment[],
      pagination: {
        currentPage: page,
        totalPages,
        totalComments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get a single comment by ID
   */
  async getCommentById(commentId: string): Promise<IComment | null> {
    const comment = await Comment.findById(commentId).populate(
      "author",
      "name email"
    );
    return comment;
  }

  /**
   * Create a new comment
   */
  async createComment(data: CreateCommentInput): Promise<IComment> {
    // If it's a reply, verify parent comment exists
    if (data.parentComment) {
      const parentExists = await Comment.findById(data.parentComment);
      if (!parentExists) {
        throw new AppError("Parent comment not found", 404);
      }
    }

    const comment = await Comment.create({
      content: data.content,
      author: new Types.ObjectId(data.author),
      parentComment: data.parentComment
        ? new Types.ObjectId(data.parentComment)
        : null,
      likes: [],
      dislikes: [],
    });

    await comment.populate("author", "name email");

    // Emit Socket.io event for real-time updates
    try {
      const io = getIO();
      io.emit("comment:created", {
        comment: comment.toObject(),
        parentComment: data.parentComment || null,
      });
    } catch (error) {
      console.error("Socket.io emit error:", error);
    }

    return comment;
  }

  /**
   * Update a comment (only by the author)
   */
  async updateComment(
    commentId: string,
    userId: string,
    data: UpdateCommentInput
  ): Promise<IComment> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      throw new AppError("You can only edit your own comments", 403);
    }

    comment.content = data.content;
    await comment.save();
    await comment.populate("author", "name email");

    // Emit Socket.io event for real-time updates
    try {
      const io = getIO();
      io.emit("comment:updated", {
        comment: comment.toObject(),
      });
    } catch (error) {
      console.error("Socket.io emit error:", error);
    }

    return comment;
  }

  /**
   * Delete a comment (only by the author)
   */
  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      throw new AppError("You can only delete your own comments", 403);
    }

    // Delete the comment and all its replies
    await Comment.deleteMany({
      $or: [{ _id: commentId }, { parentComment: commentId }],
    });

    // Emit Socket.io event for real-time updates
    try {
      const io = getIO();
      io.emit("comment:deleted", {
        commentId,
        parentComment: comment.parentComment,
      });
    } catch (error) {
      console.error("Socket.io emit error:", error);
    }
  }

  /**
   * Like a comment
   */
  async likeComment(commentId: string, userId: string): Promise<IComment> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    const userObjectId = new Types.ObjectId(userId);

    // Check if user already liked
    const alreadyLiked = comment.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      // Remove like
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    } else {
      // Remove dislike if exists
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId
      );
      // Add like
      comment.likes.push(userObjectId);
    }

    await comment.save();
    await comment.populate("author", "name email");

    // Emit Socket.io event for real-time updates
    try {
      const io = getIO();
      io.emit("comment:liked", {
        commentId: comment._id.toString(),
        likesCount: comment.likes.length,
        dislikesCount: comment.dislikes.length,
        action: alreadyLiked ? "unlike" : "like",
      });
    } catch (error) {
      console.error("Socket.io emit error:", error);
    }

    return comment;
  }

  /**
   * Dislike a comment
   */
  async dislikeComment(commentId: string, userId: string): Promise<IComment> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    const userObjectId = new Types.ObjectId(userId);

    // Check if user already disliked
    const alreadyDisliked = comment.dislikes.some(
      (id) => id.toString() === userId
    );

    if (alreadyDisliked) {
      // Remove dislike
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Remove like if exists
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
      // Add dislike
      comment.dislikes.push(userObjectId);
    }

    await comment.save();
    await comment.populate("author", "name email");

    // Emit Socket.io event for real-time updates
    try {
      const io = getIO();
      io.emit("comment:disliked", {
        commentId: comment._id.toString(),
        likesCount: comment.likes.length,
        dislikesCount: comment.dislikes.length,
        action: alreadyDisliked ? "undislike" : "dislike",
      });
    } catch (error) {
      console.error("Socket.io emit error:", error);
    }

    return comment;
  }

  /**
   * Get replies for a comment
   */
  async getReplies(
    commentId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedComments> {
    return this.getComments({
      parentComment: commentId,
      page,
      limit,
      sort: "newest",
    });
  }
}
