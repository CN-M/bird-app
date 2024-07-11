// import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/db";
import { generateAccessToken, generateRefreshToken } from "../config/util";

//

require("dotenv").config();

const { REFRESH_SECRET, NODE_ENV } = process.env;

require("dotenv").config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, profileName, password } = req.body;

    if (!email || !profileName || !username || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const lowercaseUsername = username.toLowerCase();

    const userExists = await prisma.user.findFirst({
      where: { username: lowercaseUsername },
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        profileName,
        email,
        username: lowercaseUsername,
        profilePicture: null,
        // password: hashedPassword,
        password,
      },
    });

    if (newUser) {
      const { id, profileName, email, isPremium, profilePicture } = newUser;

      const accessToken = generateAccessToken({
        id,
        username,
        profileName,
        isPremium,
        profilePicture: profilePicture ? profilePicture : "default",
      });

      const refreshToken = generateRefreshToken({
        id,
        username,
        profileName,
        isPremium,
        profilePicture: profilePicture ? profilePicture : "default",
      });

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          // secure: NODE_ENV === "production",
          secure: true,
          // sameSite: NODE_ENV === "production" ? "strict" : "lax",
          sameSite: "none",
          maxAge: 15 * 24 * 60 * 60 * 1000, // 15 Days
        })
        .header("authorization", accessToken);

      return res.status(201).json({
        id,
        profileName,
        username,
        accessToken,
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const lowercaseUsername = username.toLowerCase();

    const user = await prisma.user.findFirst({
      where: { username: lowercaseUsername },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Remember to change this back
    // const passwordMatch = await bcrypt.compare(password, user.password!);
    const passwordMatch = password === user.password!;

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const {
      id,
      username: userUsername,
      profileName,
      profilePicture,
      isPremium,
      email,
    } = user;

    const accessToken = generateAccessToken({
      id,
      username: userUsername,
      profileName,
      isPremium,
      profilePicture: profilePicture ? profilePicture : "default",
    });

    const refreshToken = generateRefreshToken({
      id,
      username,
      profileName,
      isPremium,
      profilePicture: profilePicture ? profilePicture : "default",
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: NODE_ENV === "production",
        secure: true,
        // sameSite: NODE_ENV === "production" ? "strict" : "lax",
        sameSite: "none",
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 Days
      })
      .header("authorization", accessToken);

    return res.status(201).json({
      id,
      profileName,
      username: userUsername,
      accessToken,
    });
  } catch (err) {
    console.error("Error logging in user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    console.log("logout console:", req.cookies["refreshToken"]);
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "User successfully logged out" });
  } catch (err) {
    console.error("Error logging out user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshUser = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    return res.status(401).json({ error: "Not authorised, no refresh token!" });
  }

  try {
    const { id } = jwt.verify(refreshToken, REFRESH_SECRET!) as JwtPayload;

    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        profileName: true,
        username: true,
        isPremium: true,
        profilePicture: true,
        email: true,
        password: false,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);

    console.log("New User successfully refreshed");

    res.header("authorization", newAccessToken);

    req.user = user;
  } catch (err) {
    console.error("Error:", err);
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};
