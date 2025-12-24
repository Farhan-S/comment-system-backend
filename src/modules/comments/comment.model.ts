import mongoose, { Document, Schema, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  parentComment?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  dislikesCount: number;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual fields for counts
commentSchema.virtual("likesCount").get(function () {
  return this.likes?.length || 0;
});

commentSchema.virtual("dislikesCount").get(function () {
  return this.dislikes?.length || 0;
});

// Indexes for performance
commentSchema.index({ author: 1 });
commentSchema.index({ createdAt: -1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ likes: 1 });
commentSchema.index({ dislikes: 1 });

// Compound index for sorting by likes/dislikes
commentSchema.index({ likes: -1, createdAt: -1 });
commentSchema.index({ dislikes: -1, createdAt: -1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
