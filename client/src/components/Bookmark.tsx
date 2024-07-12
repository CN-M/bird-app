// import axios from "axios";
import { useState } from "react";
import { FaRegBookmark } from "react-icons/fa";
// import { useAuthStore } from "../lib/authStore";
// import { rootURL } from "../lib/utils";

export const Bookmark = (
  {
    // commentId,
    // postId,
  }: {
    commentId?: string;
    postId?: string;
  }
) => {
  // const user = useAuthStore((state) => state.user);

  // let route: string;
  // if (postId) {
  //   route = `${postId}/post`;
  // } else if (commentId) {
  //   route = `${commentId}/comment`;
  // }

  //   const hasLiked = likes.some((like) => like.userId === user?.id);
  const hasBookmarked = false;

  const [bookmarked, setBookmarked] = useState(hasBookmarked);

  const [bookmarkIsLoading, setBookmarkIsLoading] = useState(false);

  const handleRemoveBookmark = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();
    setBookmarkIsLoading(true);
    try {
      console.log("Remove bookmark");

      // if (!user || !user.accessToken) {
      //   throw new Error("User not authenticated or token not available.");
      // }

      // await axios.delete(`${rootURL}/likes/${route}`, {
      //   withCredentials: true,
      //   headers: { Authorization: `Bearer ${user?.accessToken}` },
      // });
      setBookmarkIsLoading(false);
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error("Error", err);
      setBookmarkIsLoading(false);
    }
  };

  const handleBookmark = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();

    setBookmarkIsLoading(true);
    try {
      console.log("Add bookmark");

      // if (!user || !user.accessToken) {
      //   throw new Error("User not authenticated or token not available.");
      // }

      // await axios.post(
      //   `${rootURL}/likes/${route}`,
      //   {},
      //   {
      //     withCredentials: true,
      //     headers: { Authorization: `Bearer ${user.accessToken}` },
      //   }
      // );
      setBookmarkIsLoading(false);
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error("Error", err);
      setBookmarkIsLoading(false);
    }
  };

  return (
    <>
      {bookmarked ? (
        <span
          onClick={handleRemoveBookmark}
          aria-disabled={bookmarkIsLoading}
          className="flex items-center justify-center gap-1 text-emerald-500 hover:bg-emerald-500/25 rounded-full px-2 cursor-pointer"
        >
          <FaRegBookmark className="size-5" />
        </span>
      ) : (
        <span
          onClick={handleBookmark}
          aria-disabled={bookmarkIsLoading}
          className="flex items-center justify-center gap-1 hover:bg-emerald-500/25 hover:text-emerald-500 rounded-full px-2 cursor-pointer"
        >
          <FaRegBookmark className="size-5" />
        </span>
      )}
    </>
  );
};
