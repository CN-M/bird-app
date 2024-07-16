import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { PostType } from "../types";
import { Bookmark } from "./Bookmark";
import { Like } from "./Like";
import { Reply } from "./Reply";
import { User } from "./User";

export const Post = ({
  post,
  userPosts,
  generalPosts,
  setGeneralFeedPosts,
  setUserFeedPosts,
}: {
  post: PostType;
  userPosts: PostType[];
  generalPosts: PostType[];
  setGeneralFeedPosts: Dispatch<SetStateAction<PostType[]>>;
  setUserFeedPosts: Dispatch<SetStateAction<PostType[]>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  const { id, author, content, createdAt, comments, likes } = post;
  const { username, id: authorId } = author;

  const handleDelete = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    const originalUserPosts = userPosts;
    const originalGeneralPosts = generalPosts;

    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      const updatedUserPosts = originalUserPosts.filter(
        (post) => post.id !== id
      );
      const updatedGeneralPosts = originalGeneralPosts.filter(
        (post) => post.id !== id
      );

      setGeneralFeedPosts(updatedGeneralPosts);
      setUserFeedPosts(updatedUserPosts);

      await axios.delete(`${rootURL}/posts/${username}/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (err) {
      console.error("Error", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start border-b p-5 hover:bg-gray-100 transition-colors duration-300">
      <Link to={`/${author.username}`} className="flex items-center space-x-3">
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
          <Bookmark postId={id} />
        </div>
        {user?.id === authorId && (
          <span
            onClick={handleDelete}
            aria-disabled={isLoading}
            className="flex items-center justify-center gap-1 hover:bg-gray-500/25 hover:text-gray-500 rounded-full px-2 cursor-pointer"
          >
            <FaTrash className="size-5" />
          </span>
        )}
      </div>
    </div>
  );
};
