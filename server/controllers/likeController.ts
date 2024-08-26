import { Request, Response } from "express";
import { prisma } from "../config/db";
import { redisClient } from "../config/redis";

export const getPostLikes = async (req: Request, res: Response) => {
  const { postId } = req.body;

  try {
    const likes = await prisma.like.findFirst({
      where: { postId },
    });

    if (!likes) {
      return res
        .status(200)
        .json({ likes: 0, message: "No likes on this post" });
    }

    return res.status(200).json(likes);
  } catch (err) {
    console.error("Error fetching likes", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCommentLikes = async (req: Request, res: Response) => {
  const { commentId } = req.body;

  try {
    const likes = await prisma.like.findFirst({
      where: { commentId },
    });

    if (!likes) {
      return res
        .status(200)
        .json({ likes: 0, message: "No like on this comment" });
    }

    return res.status(200).json(likes);
  } catch (err) {
    console.error("Error fetching likes", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likePost = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  // const { postId } = req.body;
  const { postId } = req.params;
  const { id: userId } = user;

  try {
    const likeExists = await prisma.like.findFirst({
      where: { postId, userId },
    });

    if (likeExists) {
      return res.status(400).json({ error: "Post already liked" });
    }

    const newLike = await prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    await redisClient.del(`following_posts:${userId}`);
    console.log("Redis Cache Invalidated");

    res.status(200).json(newLike);
  } catch (err) {
    console.error("Error liking post", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  // const { postId } = req.body;
  const { postId } = req.params;
  const { id: userId } = user;

  try {
    const like = await prisma.like.findFirst({
      where: { postId, userId },
    });

    if (!like) {
      return res.status(400).json({ error: "Like relationship not found" });
    }

    const { id } = like;

    const deletedLike = await prisma.like.delete({
      where: { id },
    });

    await redisClient.del(`following_posts:${userId}`);
    console.log("Redis Cache Invalidated");

    res
      .status(200)
      .json({ message: "Post successfully unliked", follow: deletedLike });
  } catch (err) {
    console.error("Error unliking post", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  // const { commentId } = req.body;
  const { commentId } = req.params;
  const { id: userId } = user;

  try {
    const likeExists = await prisma.like.findFirst({
      where: { commentId, userId },
    });

    if (likeExists) {
      return res.status(400).json({ error: "Comment already liked" });
    }

    const newLike = await prisma.like.create({
      data: {
        comment: { connect: { id: commentId } },
        user: { connect: { id: userId } },
      },
    });

    res.status(200).json(newLike);
  } catch (err) {
    console.error("Error liking comment", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unlikeComment = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  // const { commentId } = req.body;
  const { commentId } = req.params;
  const { id: userId } = user;

  try {
    const like = await prisma.like.findFirst({
      where: { commentId, userId },
    });

    if (!like) {
      return res.status(400).json({ error: "Like relationship not found" });
    }

    const { id } = like;

    const deletedLike = await prisma.like.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ message: "Comment successfully unliked", follow: deletedLike });
  } catch (err) {
    console.error("Error unliking comment", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
