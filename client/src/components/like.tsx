import axios from "axios";
import { useState } from "react";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { Like } from "../types";

export const LikeComp = ({
  commentId,
  postId,
  likes,
}: {
  commentId?: string;
  postId?: string;
  likes: Like[];
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

  const handleUnlike = async () => {
    setUnlikeIsLoading(true);
    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      await axios.delete(`${rootURL}/likes/${route}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
      setUnlikeIsLoading(false);
      setTotalLikes(totalLikes - 1);
      setLiked(!liked);
    } catch (err) {
      console.error("Error", err);
      setUnlikeIsLoading(false);
    }
  };

  const handleLike = async () => {
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
      setLikeIsLoading(false);
      setTotalLikes(totalLikes + 1);
      setLiked(!liked);
    } catch (err) {
      console.error("Error", err);
      setLikeIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {liked ? (
        <button
          className="bg-red-500 rounded-lg px-3 py-1 text-white"
          onClick={handleUnlike}
          disabled={unlikeIsLoading}
        >
          {unlikeIsLoading ? "Unliking..." : "Unlike"}
        </button>
      ) : (
        <button
          className="bg-indigo-500 rounded-lg px-3 py-1 text-white"
          onClick={handleLike}
          disabled={likeIsLoading}
        >
          {likeIsLoading ? "Liking..." : "Like"}
        </button>
      )}
      <p>{totalLikes} Likes</p>
    </div>
  );
};
