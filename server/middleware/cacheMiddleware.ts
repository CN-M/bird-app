import { NextFunction, Request, Response } from "express";
import { redisClient } from "../config/redis";

export const cache = async (
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
