// frontend/components/BookmarksPage.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
// import { Bookmark as BookmarkType } from "../types";
import { MainLayout } from "../components/MainLayout";
import { Post } from "../components/Post";

import { PostType } from "../types";

export const Bookmarks = () => {
  //   const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [bookmarks, setBookmarks] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!user || !user.accessToken) {
          throw new Error("User not authenticated or token not available.");
        }

        // const response = await axios.get(`${rootURL}/bookmarks`, {
        const response = await axios.get(`${rootURL}/posts`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
          withCredentials: true,
        });

        setBookmarks(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  if (isLoading) {
    return <p>Loading bookmarks...</p>;
  }

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-4 border-b p-4">Bookmarks</h2>
      {user ? (
        <>
          {bookmarks.length === 0 ? (
            <p>You have no bookmarks.</p>
          ) : (
            bookmarks.map((bookmark) => (
              <Post key={bookmark.id} post={bookmark} />
            ))
          )}
        </>
      ) : (
        <p>Login to see your bookmarks</p>
      )}
    </MainLayout>
  );
};
