import { Request, Response } from "express";
import { prisma } from "../config/db";
import { redisClient } from "../config/redis";

export const getPostBookmarks = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const bookmarks = await prisma.bookmark.findFirst({
      where: { postId },
    });

    if (!bookmarks) {
      return res
        .status(200)
        .json({ bookmarks: 0, message: "No bookmarks on this post" });
    }

    return res.status(200).json(bookmarks);
  } catch (err) {
    console.error("Error fetching bookmarks", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserBookmarks = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }
  const { username } = req.params;
  const { id: userId } = user;

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { user: { username, id: userId } },
      select: {
        post: {
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
        },
      },
    });

    await redisClient.set(`bookmarks:${userId}`, JSON.stringify(bookmarks), {
      EX: 300,
    });

    res.status(200).json(bookmarks);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const bookmarkPost = async (req: Request, res: Response) => {
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
    const bookmarkExists = await prisma.bookmark.findFirst({
      where: { postId, userId },
    });

    if (bookmarkExists) {
      return res.status(400).json({ error: "Post already bookmarked" });
    }

    const newbookmark = await prisma.bookmark.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    await redisClient.del(`bookmarks:${userId}`);
    console.log("Redis Cache Invalidated");

    res.status(200).json(newbookmark);
  } catch (err) {
    console.error("Error bookmarking post", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unbookmarkPost = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { postId } = req.params;
  const { id: userId } = user;

  try {
    const bookmark = await prisma.bookmark.findFirst({
      where: { postId, userId },
    });

    if (!bookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    const { id } = bookmark;

    const deletedBookmark = await prisma.bookmark.delete({
      where: { id },
    });

    await redisClient.del(`bookmarks:${userId}`);
    console.log("Redis Cache Invalidated");

    res
      .status(200)
      .json({ message: "Bookmark deleted", post: deletedBookmark });
  } catch (err) {
    console.error("Error deleting bookmark:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
