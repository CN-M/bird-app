import axios from "axios";
import { useState } from "react";
import {
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { Post } from "../types";
// import { CommentComp } from "./comment";
// import { LikeComp } from "./like";
import { UserComp } from "./user";

export const Tweet = ({ post }: { post: Post }) => {
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  const { id, author, content, createdAt, comments, likes } = post;
  // const { id, author, content, createdAt } = post;
  const { username, id: authorId } = author;

  const handleDelete = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      await axios.delete(`${rootURL}/posts/${username}/${id}`, {
        // data: {},
        withCredentials: true,
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Error", err);
      setIsLoading(false);
    }
  };

  const handleLikeClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault(); // Prevent default behavior of link (navigation)
    console.log("Liked");
    // handleLike(); // Call handleLike function to like the post
  };

  const handleBookmarkClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault(); // Prevent default behavior of link (navigation)
    console.log("Bookmarked");
    // handleBookmark(); // Call handleBookmark function to bookmark the post
  };

  return (
    <Link to={`/${author.username}/${id}`}>
      <div className="flex flex-col items-start border-b p-5 hover:bg-gray-100 transition-colors duration-300">
        <UserComp user={author} />
        <div className="flex flex-col space-y-1 mt-2">
          <p>{content}</p>
          {/* <p className="text-gray-500 text-sm">Date: {createdAt}</p> */}
          <p className="text-gray-500 text-sm">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex justify-between w-full mt-2">
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="flex items-center justify-center gap-1 hover:bg-blue-500/25 hover:text-blue-500 rounded-full px-2">
              {comments.length}
              <FaRegComment className="size-5" />
            </span>
            <span
              onClick={handleLikeClick}
              className="flex items-center justify-center gap-1 hover:bg-red-500/25 hover:text-red-500 rounded-full px-2"
            >
              {likes.length}
              <FaRegHeart className="size-5" />
            </span>
            <span
              onClick={handleBookmarkClick}
              className="flex items-center justify-center gap-1 hover:bg-emerald-500/25 hover:text-emerald-500 rounded-full px-2"
            >
              <FaRegBookmark className="size-5" />
            </span>
          </div>
          {user?.id === authorId && (
            <span
              onClick={handleDelete}
              className="flex items-center justify-center gap-1 hover:bg-gray-500/25 hover:text-gray-500 rounded-full px-2 cursor-pointer"
            >
              <FaTrash className="size-5" />
            </span>
          )}
          {/* {user?.id === authorId && (
            <button
              className="bg-red-500 text-white rounded-lg px-4 py-2 ml-auto"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          )} */}
        </div>
      </div>
    </Link>
  );
};
