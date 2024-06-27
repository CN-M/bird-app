import { Request, Response } from "express";
import { prisma } from "../config/db";

require("dotenv").config();

export const updateUser = async (req: Request, res: Response) => {
  const { profileName } = req.body;
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: userId } = user;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profileName,
      },
      select: { profileName: true, email: true },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: userId } = user;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
      select: { profileName: true, email: true },
    });

    res.status(200).json({ message: "User deleted", user: deletedUser });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const followUser = async (req: Request, res: Response) => {};

export const unfollowUser = async (req: Request, res: Response) => {};
