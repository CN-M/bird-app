import axios from "axios";
import { useState } from "react";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";

export const ReplyInput = ({
  postId,
  parentCommentId,
}: {
  postId?: string;
  parentCommentId?: string;
}) => {
  let route: string;
  if (postId && parentCommentId) {
    route = `reply`;
  } else if (postId) {
    route = `comment`;
  }

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  // @ts-ignore
  const handleReply = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      await axios.post(
        `${rootURL}/comments/${route}`,
        { content, postId, commentId: parentCommentId },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      setIsLoading(false);
      setContent("");
    } catch (err) {
      console.error("Error", err);
      setIsLoading(false);
    }
  };

  // @ts-ignore
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  if (!user) {
    return <div className="p-2"></div>;
  }

  return (
    <div className="border-b flex items-center space-x-3 px-2">
      {user.profilePicture ? (
        <img
          className="size-10 border border-emerald-500 rounded-full"
          src={user.profilePicture}
          alt={`@${user?.username}`}
        />
      ) : (
        <div className="size-10 flex items-center justify-center border rounded-full border-emerald-500">
          {user?.username.charAt(0).toUpperCase()}
        </div>
      )}

      <form
        className="flex w-full items-center space-x-2"
        onSubmit={handleReply}
      >
        <textarea
          onChange={handleChange}
          value={content}
          placeholder="Post your reply"
          className="w-full min-h-20 p-2 resize-none rounded-lg focus:border-blue-500 focus:ring-0 focus:outline-none"
          minLength={1}
          maxLength={280}
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 py-2 px-4 rounded-full text-white hover:bg-blue-600 transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Replying..." : "Reply"}
          </button>
        </div>
      </form>
    </div>
  );
};
