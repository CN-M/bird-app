import { NextFunction, Request, Response } from "express";
import { redisClient } from "../config/redis";

export const cacheUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  const key = `user:${username}`;
  console.log(key);

  const cachedData = await redisClient.get(key);
  if (cachedData) {
    console.log("Redis cached data used");

    const data = JSON.parse(cachedData);
    return res.status(200).json(data);
  }

  next();
};

export const cacheFollowSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id } = user;

  const key = `suggestions:${id}`;
  console.log(key);

  const cachedData = await redisClient.get(key);
  if (cachedData) {
    console.log("Redis cached data used");

    const data = JSON.parse(cachedData);
    return res.status(200).json(data);
  }

  next();
};

export const cacheUserFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id } = user;

  const key = `following_feed:${id}`;
  console.log(key);

  const cachedData = await redisClient.get(key);
  if (cachedData) {
    console.log("Redis cached data used");

    const data = JSON.parse(cachedData);
    return res.status(200).json(data);
  }

  next();
};

export const cacheSingleUserFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  const key = `single_user_feed:${username}`;
  console.log(key);

  const cachedData = await redisClient.get(key);
  if (cachedData) {
    console.log("Redis cached data used");

    const data = JSON.parse(cachedData);
    return res.status(200).json(data);
  }

  next();
};

export const cacheSinglePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;

  const key = `single_post:${postId}`;
  console.log(key);

  const cachedData = await redisClient.get(key);
  if (cachedData) {
    console.log("Redis cached data used");

    const data = JSON.parse(cachedData);
    return res.status(200).json(data);
  }

  next();
};

export const cacheBookmarks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  if (!user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id } = user;

  const key = `bookmarks:${id}`;
  console.log(key);

  const cachedData = await redisClient.get(key);
  if (cachedData) {
    console.log("Redis cached data used");

    const data = JSON.parse(cachedData);
    return res.status(200).json(data);
  }

  next();
};
