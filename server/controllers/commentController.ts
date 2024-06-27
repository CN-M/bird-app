import { Request, Response } from "express";
import { prisma } from "../config/db";

export const createComment = async (req: Request, res: Response) => {
  const { content, postId } = req.body;

  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

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

export const updateComment = async (req: Request, res: Response) => {
  const { id: commentId } = req.params;
  const { content } = req.body;

  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  if (!user.isPremium) {
    return res.status(400).json({ error: "Not Premium" });
  }

  const { id: userId } = user;

  try {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId, authorId: userId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
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
  const { id: commentId } = req.params;

  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: userId } = user;

  try {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId, authorId: userId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const deletedComment = await prisma.comment.delete({
      where: { id: commentId, authorId: userId },
    });

    res
      .status(200)
      .json({ message: "Comment deleted", comment: deletedComment });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const likeComment = async (req: Request, res: Response) => {};

export const unlikeComment = async (req: Request, res: Response) => {};
