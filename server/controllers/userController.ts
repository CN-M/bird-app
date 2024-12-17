import { Request, Response } from "express";
import { prisma } from "../config/db";
import { redisClient } from "../config/redis";

require("dotenv").config();

export const getUser = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: { username },
      select: {
        profileName: true,
        id: true,
        bio: true,
        posts: {
          select: {
            author: true,
            content: true,
            id: true,
            likes: true,
            createdAt: true,
            comments: {
              select: {
                author: { select: { username: true } },
                content: true,
                id: true,
                parentCommentId: true,
                likes: true,
                createdAt: true,
                postId: true,
                replies: true,
              },
            },
          },
        },
        isPremium: true,
        username: true,
        profilePicture: true,
        followers: true,
        following: true,
      },
    });

    await redisClient.set(`user:${username}`, JSON.stringify(user), {
      EX: 300,
    });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editUserProfile = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { profileName, profilePicture, bio } = req.body;
  const { username } = req.params;

  try {
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        profileName,
        profilePicture,
        bio,
      },
      select: { profileName: true, email: true },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const upgradeUser = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  if (user.isPremium) {
    return res.status(400).json({ error: "User already premium" });
  }

  const { username } = req.params;

  try {
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        isPremium: true,
      },
      select: { profileName: true, email: true },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const downgradeUser = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  if (!user.isPremium) {
    return res.status(400).json({ error: "User already not premium" });
  }

  const { username } = req.params;

  try {
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        isPremium: false,
      },
      select: { profileName: true, email: true },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { username } = req.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { username },
      select: { profileName: true, email: true },
    });

    res.status(200).json({ message: "User deleted", user: deletedUser });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getFollowRelationship = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { followingId } = req.body;

  if (!followingId) {
    return res.status(400).json({ error: "Following ID is required" });
  }

  const { id: userId } = user;

  try {
    const followExists = await prisma.follower.findFirst({
      where: { followerId: userId, followingId },
    });

    if (!followExists) {
      return res.status(200).json({
        following: false,
        message: `${user.profileName} is not following ${followingId}`,
      });
    } else {
      return res.status(200).json({
        following: true,
        message: `${user.profileName} is following ${followingId}`,
        followData: followExists,
      });
    }
  } catch (err) {
    console.error("Error following user", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFollowSuggestions = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: userId } = user;

  try {
    const following = await prisma.follower.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((follower) => follower.followingId);

    const suggestions = await prisma.user.findMany({
      take: 5,
      where: {
        id: { notIn: followingIds, not: userId },
      },
      select: {
        id: true,
        isPremium: true,
        profileName: true,
        profilePicture: true,
        username: true,
      },
    });

    await redisClient.set(
      `suggestions:${userId}`,
      JSON.stringify(suggestions),
      {
        EX: 300,
      }
    );

    res.status(200).json(suggestions);
  } catch (err) {
    console.error("Error following user", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const followUser = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { followingId } = req.body;
  const { id: userId } = user;

  try {
    const followExists = await prisma.follower.findFirst({
      where: { followerId: userId, followingId },
    });

    if (followExists) {
      return res.status(400).json({ error: "Already following this user" });
    }

    const newFollow = await prisma.follower.create({
      data: {
        follower: { connect: { id: userId } },
        following: { connect: { id: followingId } },
      },
    });

    await redisClient.del(`suggestions:${userId}`);

    res.status(200).json(newFollow);
  } catch (err) {
    console.error("Error following user", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { followingId } = req.body;
  const { id: userId } = user;

  try {
    const follow = await prisma.follower.findFirst({
      where: { followerId: userId, followingId },
    });

    if (!follow) {
      return res.status(400).json({ error: "Follow relationship not found" });
    }

    const { id } = follow;

    const deletedFollow = await prisma.follower.delete({
      where: { id },
    });

    await redisClient.del(`suggestions:${userId}`);

    res.status(200).json(deletedFollow);
  } catch (err) {
    console.error("Error unfollowing user ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
