import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getPostComments = async (req: Request, res: Response) => {
  const { postId } = req.body;

  try {
    const comments = await prisma.comment.findFirst({
      where: { postId },
    });

    if (!comments) {
      return res
        .status(200)
        .json({ comments: 0, message: "No comments on this post" });
    }

    return res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCommentReplies = async (req: Request, res: Response) => {
  const { commentId } = req.body;

  try {
    const comments = await prisma.comment.findFirst({
      where: { parentCommentId: commentId },
    });

    if (!comments) {
      return res
        .status(200)
        .json({ replies: 0, message: "No replies on this comment" });
    }

    return res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching replies", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createPostComment = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }
  const { content, postId } = req.body;
  const { id: userId } = user;

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });

    res.status(200).json(newComment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createCommentReply = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }
  const { content, postId, commentId } = req.body;
  const { id: userId } = user;

  try {
    const newPostComment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        parentComment: { connect: { id: commentId } },
        author: { connect: { id: userId } },
      },
    });

    res.status(200).json(newPostComment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  if (!user.isPremium) {
    return res.status(400).json({ error: "Not Premium, not permitted" });
  }

  const { id: commentId } = req.params;
  const { content } = req.body;

  const { id: userId } = user;

  try {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId, authorId: userId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const { id } = comment;

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content,
      },
    });

    res.status(200).json(updatedComment);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: commentId } = req.params;
  const { id: userId } = user;

  try {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId, authorId: userId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const { id } = comment;

    const deletedComment = await prisma.comment.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ message: "Comment deleted", comment: deletedComment });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
