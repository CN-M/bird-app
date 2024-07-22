import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Bookmark } from "../components/Bookmark";
import { Like } from "../components/Like";
import { MainLayout } from "../components/MainLayout";
import { Reply } from "../components/Reply";
import { User } from "../components/User";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { BookmarkType, PostType } from "../types";

export const Bookmarks = () => {
  const [bookmarkPosts, setBookmarkPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!user || !user.accessToken) {
          throw new Error("User not authenticated or token not available.");
        }

        const { data }: { data: BookmarkType[] } = await axios.get(
          `${rootURL}/bookmark/${user.username}`,
          {
            // const response = await axios.get(`${rootURL}/posts`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
            withCredentials: true,
          }
        );

        const posts = data.map((bookmark) => bookmark.post);

        setBookmarkPosts(posts.reverse());
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleDelete = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    username: string,
    id: string
  ) => {
    e.preventDefault();
    setIsLoading(true);

    const originalBookmarkPosts = bookmarkPosts;

    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      const updatedBookmarkPosts = originalBookmarkPosts?.filter(
        (post) => post.id !== id
      );

      if (updatedBookmarkPosts && setBookmarkPosts) {
        setBookmarkPosts(updatedBookmarkPosts);
      }

      await axios.delete(`${rootURL}/posts/${username}/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (err) {
      console.error("Error", err);
      setBookmarkPosts(originalBookmarkPosts);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading bookmarks...</p>;
  }

  return (
    <MainLayout classNames="lg:w-1/4">
      <h2 className="text-2xl font-bold mb-4 border-b p-4">Bookmarks</h2>
      {user ? (
        <>
          {bookmarkPosts.length === 0 ? (
            <p>You have no bookmarkPosts.</p>
          ) : (
            bookmarkPosts.map(
              ({
                id,
                content,
                comments,
                likes,
                author,
                bookmarks,
                createdAt,
              }) => (
                <div
                  key={id}
                  className="flex flex-col items-start border-b p-5 hover:bg-gray-100 transition-colors duration-300"
                >
                  <Link
                    to={`/${author.username}`}
                    className="flex items-center space-x-3"
                  >
                    <User user={author} />
                  </Link>
                  <Link
                    to={`/${author.username}/${id}`}
                    className="flex flex-col space-y-1 mt-2 w-full"
                  >
                    <p>{content}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                  <div className="flex justify-between w-full mt-2">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Reply comments={comments} />
                      <Like likes={likes} postId={id} />
                      <Bookmark
                        bookmarkPosts={bookmarkPosts}
                        setBookmarkPosts={setBookmarkPosts}
                        bookmarks={bookmarks}
                        postId={id}
                      />
                    </div>
                    {user?.id === author.id && (
                      <span
                        onClick={(e) => handleDelete(e, author.username, id)}
                        aria-disabled={isLoading}
                        className="flex items-center justify-center gap-1 hover:bg-gray-500/25 hover:text-gray-500 rounded-full px-2 cursor-pointer"
                      >
                        <FaTrash className="size-5" />
                      </span>
                    )}
                  </div>
                </div>
              )
            )
          )}
        </>
      ) : (
        <p>Login to see your bookmarks</p>
      )}
    </MainLayout>
  );
};
