import jwt from "jsonwebtoken";
require("dotenv").config();

const { SECRET, REFRESH_SECRET } = process.env;

type User = {
  id: string;
  profileName: string;
  profilePicture: string | null;
  username: string;
  isPremium: boolean;
  email: string;
};

export const generateAccessToken = (user: User) => {
  return jwt.sign(user, SECRET!, { expiresIn: "10" });
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign(user, REFRESH_SECRET!, { expiresIn: "15d" });
};
