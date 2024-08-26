import { createClient } from "redis";

const { REDIS_URL } = process.env;

export const redisClient = createClient({
  url: REDIS_URL || "redis://localhost:6379",
});
