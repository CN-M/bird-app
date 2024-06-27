import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getGeneralFeedPosts = async (req: Request, res: Response) => {
  // const { user } = req;

  // if (!user) {
  //   return res
  //     .status(400)
  //     .json({ error: "Not authoriized, please login or register" });
  // }

  try {
    const posts = await prisma.post.findMany({ take: 10 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  const { user } = req;
  const { id } = req.params;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  // const { id } = user;

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

export const getUserFeedPosts = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id } = user;

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: id },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { content } = req.body;

  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

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
  const { id: postId } = req.params;
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
    const post = await prisma.post.findFirst({
      where: { id: postId, authorId: userId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
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
  const { id: postId } = req.params;

  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: userId } = user;

  try {
    const post = await prisma.post.findFirst({
      where: { id: postId, authorId: userId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const deletedPost = await prisma.post.delete({
      where: { id: postId, authorId: userId },
    });

    res.status(200).json({ message: "Post deleted", post: deletedPost });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
