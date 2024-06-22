import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkAndDeleteExpiredItem = (key: string, maxAge: number) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return;

  const user: User = JSON.parse(itemStr);

  const currentTime = new Date().getTime();

  // If the item is older than maxAge (in milliseconds), delete it
  if (currentTime - user.timestamp > maxAge) {
    localStorage.removeItem(key);
  }
};
