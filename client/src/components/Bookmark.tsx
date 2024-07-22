import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { FaRegBookmark } from "react-icons/fa";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { BookmarkType, PostType } from "../types";

export const Bookmark = ({
  bookmarks,
  postId,
  bookmarkPosts,
  setBookmarkPosts,
}: {
  bookmarkPosts?: PostType[];
  setBookmarkPosts?: Dispatch<SetStateAction<PostType[]>>;
  bookmarks: BookmarkType[];
  postId?: string;
}) => {
  const user = useAuthStore((state) => state.user);

  const hasBookmarked = bookmarks.some(
    (bookmark) => bookmark.userId === user?.id
  );

  const [totalBookmarks, setTotalBookmarks] = useState(bookmarks.length);
  const [bookmarked, setBookmarked] = useState(hasBookmarked);
  const [bookmarkIsLoading, setBookmarkIsLoading] = useState(false);

  const handleRemoveBookmark = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();

    const originalBookmarkPosts = bookmarkPosts;

    // Optimistic Updates
    const newTotalBookmarks = bookmarked
      ? totalBookmarks - 1
      : totalBookmarks + 1;
    setTotalBookmarks(newTotalBookmarks);
    setBookmarked(!bookmarked);

    setBookmarkIsLoading(true);
    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      const updatedBookmarkPosts = originalBookmarkPosts?.filter(
        (post) => post.id !== postId
      );

      if (updatedBookmarkPosts && setBookmarkPosts) {
        setBookmarkPosts(updatedBookmarkPosts);
      }

      await axios.delete(`${rootURL}/bookmark/${postId}/post`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
    } catch (err) {
      console.error("Error", err);

      if (originalBookmarkPosts && setBookmarkPosts) {
        setBookmarkPosts(originalBookmarkPosts);
      }

      setTotalBookmarks(totalBookmarks);
      setBookmarked(!bookmarked);
    } finally {
      setBookmarkIsLoading(false);
    }
  };

  const handleBookmark = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();

    // Optimistic Updates
    const newTotalBookmarks = bookmarked
      ? totalBookmarks - 1
      : totalBookmarks + 1;
    setTotalBookmarks(newTotalBookmarks);
    setBookmarked(!bookmarked);

    setBookmarkIsLoading(true);
    try {
      console.log("Add bookmark");

      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      await axios.post(
        `${rootURL}/bookmark/${postId}/post`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
    } catch (err) {
      console.error("Error", err);

      setTotalBookmarks(totalBookmarks);
      setBookmarked(!bookmarked);
    } finally {
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
          {totalBookmarks}
          <FaRegBookmark className="size-5" />
        </span>
      ) : (
        <span
          onClick={handleBookmark}
          aria-disabled={bookmarkIsLoading}
          className="flex items-center justify-center gap-1 hover:bg-emerald-500/25 hover:text-emerald-500 rounded-full px-2 cursor-pointer"
        >
          {totalBookmarks}
          <FaRegBookmark className="size-5" />
        </span>
      )}
    </>
  );
};
