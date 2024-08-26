import { Request, Response } from "express";
import { prisma } from "../config/db";
import { redisClient } from "../config/redis";

// Do not need to be authed to see these
export const getGeneralFeed = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      // take: 10,
      select: {
        author: {
          select: {
            id: true,
            profileName: true,
            isPremium: true,
            profilePicture: true,
            username: true,
          },
        },
        bookmarks: {
          select: {
            postId: true,
            userId: true,
          },
        },
        comments: {
          select: {
            author: { select: { username: true, profilePicture: true } },
            content: true,
            id: true,
            parentCommentId: true,
            likes: true,
            createdAt: true,
            postId: true,
            replies: true,
          },
        },
        content: true,
        likes: true,
        createdAt: true,
        id: true,
      },
      orderBy: { createdAt: "desc" },
    });

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
      // where: { followingId: userId },
      where: { followerId: userId },
      select: { followingId: true },
      orderBy: { createdAt: "desc" },
    });

    if (!following || following.length === 0) {
      // return res.status(400).json();
      return res.status(200).json([]);
    }

    const followingIds = following.map((user) => user.followingId);

    const posts = await prisma.post.findMany({
      where: {
        author: {
          id: { in: [...followingIds, userId] },
        },
      },
      select: {
        author: {
          select: {
            id: true,
            profileName: true,
            isPremium: true,
            profilePicture: true,
            username: true,
          },
        },
        bookmarks: {
          select: {
            postId: true,
            userId: true,
          },
        },
        comments: {
          select: {
            author: { select: { username: true, profilePicture: true } },
            content: true,
            id: true,
            parentCommentId: true,
            likes: true,
            createdAt: true,
            postId: true,
            replies: true,
          },
        },

        content: true,
        likes: true,
        createdAt: true,
        id: true,
      },
    });

    await redisClient.set(`following_feed:${userId}`, JSON.stringify(posts), {
      EX: 300,
    });

    console.log("Data cached to Redis");

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get feed of posts by 1 user
export const getSingleUserFeed = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: { author: { username } },
      select: {
        author: {
          select: {
            id: true,
            profileName: true,
            isPremium: true,
            profilePicture: true,
            username: true,
          },
        },
        bookmarks: {
          select: {
            postId: true,
            userId: true,
          },
        },
        comments: {
          select: {
            author: { select: { username: true, profilePicture: true } },
            content: true,
            id: true,
            parentCommentId: true,
            likes: true,
            createdAt: true,
            postId: true,
            replies: true,
          },
        },
        content: true,
        likes: true,
        createdAt: true,
        id: true,
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findFirst({
      where: { id: postId },
      select: {
        author: {
          select: {
            id: true,
            profileName: true,
            isPremium: true,
            profilePicture: true,
            username: true,
          },
        },
        bookmarks: {
          select: {
            postId: true,
            userId: true,
          },
        },
        comments: {
          where: { parentCommentId: null },
          select: {
            author: {
              select: {
                username: true,
                profilePicture: true,
                profileName: true,
                isPremium: true,
              },
            },
            content: true,
            id: true,
            parentCommentId: true,
            likes: true,
            createdAt: true,
            postId: true,
            replies: true,
            authorId: true,
          },
        },
        content: true,
        likes: true,
        createdAt: true,
        id: true,
      },
    });

    if (!post) {
      res.status(400).json({ error: "Post not found" });
    } else {
      res.status(200).json(post);
    }
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ error: "Internal server error" });
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

    await redisClient.del(`following_feed:${userId}`);
    console.log("Redis Cache Invalidated");

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

  const { postId } = req.params;
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

    await redisClient.del(`following_feed:${userId}`);
    console.log("Redis Cache Invalidated");

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

  const { postId } = req.params;
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

    await redisClient.del(`following_feed:${userId}`);
    console.log("Redis Cache Invalidated");

    res.status(200).json({ message: "Post deleted", post: deletedPost });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
