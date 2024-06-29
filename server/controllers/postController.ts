import { Request, Response } from "express";
import { prisma } from "../config/db";

// Do not need to be authed to see these
export const getGeneralFeed = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({ take: 10 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get feed posts of people user is following
export const getFollowingFeed = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: userId } = user;

  try {
    const following = await prisma.follower.findMany({
      where: { followingId: userId },
    });

    if (!following) {
      return res.status(400).json({ error: "User not following anyone" });
    }

    // Too tired. Finish later

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get feed of posts by 1 user
export const getSingleUserFeed = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: id },
      take: 10,
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }
  const { content } = req.body;
  const { id: userId } = user;

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        author: { connect: { id: userId } },
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  if (!user.isPremium) {
    return res.status(400).json({ error: "Not Premium, not permitted" });
  }

  const { id: postId } = req.params;
  const { content } = req.body;
  const { id: userId } = user;

  try {
    const post = await prisma.post.findFirst({
      where: { id: postId, authorId: userId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const { id } = post;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        content,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: postId } = req.params;
  const { id: userId } = user;

  try {
    const post = await prisma.post.findFirst({
      where: { id: postId, authorId: userId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const { id } = post;

    const deletedPost = await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted", post: deletedPost });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
