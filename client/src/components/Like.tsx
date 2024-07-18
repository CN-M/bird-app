import axios from "axios";
import { useState } from "react";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { LikeType } from "../types";

import { FaRegHeart } from "react-icons/fa";

export const Like = ({
  commentId,
  postId,
  likes,
}: {
  commentId?: string;
  postId?: string;
  likes: LikeType[];
}) => {
  const user = useAuthStore((state) => state.user);

  let route: string;
  if (postId) {
    route = `${postId}/post`;
  } else if (commentId) {
    route = `${commentId}/comment`;
  }

  const hasLiked = likes.some((like) => like.userId === user?.id);

  const [totalLikes, setTotalLikes] = useState(likes.length);
  const [liked, setLiked] = useState(hasLiked);

  const [likeIsLoading, setLikeIsLoading] = useState(false);
  const [unlikeIsLoading, setUnlikeIsLoading] = useState(false);

  const handleLike = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();

    // Optimistic Updates
    const newTotalLikes = liked ? totalLikes - 1 : totalLikes + 1;
    setTotalLikes(newTotalLikes);
    setLiked(!liked);

    setLikeIsLoading(true);
    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      await axios.post(
        `${rootURL}/likes/${route}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
    } catch (err) {
      console.error("Error", err);

      setTotalLikes(totalLikes);
      setLiked(!liked);

      setLikeIsLoading(false);
    } finally {
      setLikeIsLoading(false);
    }
  };

  const handleUnlike = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();

    // Optimistic Updates
    const newTotalLikes = liked ? totalLikes - 1 : totalLikes + 1;
    setTotalLikes(newTotalLikes);
    setLiked(!liked);

    setUnlikeIsLoading(true);
    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      await axios.delete(`${rootURL}/likes/${route}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
    } catch (err) {
      console.error("Error", err);

      setTotalLikes(totalLikes);
      setLiked(!liked);

      setUnlikeIsLoading(false);
    } finally {
      setUnlikeIsLoading(false);
    }
  };

  return (
    <>
      {liked ? (
        <span
          onClick={handleUnlike}
          // onClick={handleLike}
          aria-disabled={unlikeIsLoading}
          className="flex items-center justify-center gap-1 text-red-500 hover:bg-red-500/25 hover: rounded-full px-2 cursor-pointer"
        >
          {totalLikes}
          <FaRegHeart className="size-5" />
        </span>
      ) : (
        <span
          onClick={handleLike}
          aria-disabled={likeIsLoading}
          className="flex items-center justify-center gap-1 hover:bg-red-500/25 hover:text-red-500 rounded-full px-2 cursor-pointer"
        >
          {totalLikes}
          <FaRegHeart className="size-5" />
        </span>
      )}
    </>
  );
};
