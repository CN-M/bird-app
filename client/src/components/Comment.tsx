import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/authStore";

import { FaTrash } from "react-icons/fa";
import { Bookmark } from "./Bookmark";
import { Like } from "./Like";
import { Reply } from "./Reply";
import { User } from "./User";

import { rootURL } from "../lib/utils";

import { CommentType } from "../types";

export const Comment = ({
  replies,
  comments,
}: {
  replies: boolean;
  comments: CommentType[];
}) => {
  const user = useAuthStore((state) => state.user);
  console.log(replies, comments);

  const navigate = useNavigate();

  const areTheseReplies = replies;
  console.log(areTheseReplies);

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (
    postId: string,
    commentId: string,
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      await axios.delete(`${rootURL}/comments/${postId}/${commentId}`, {
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

  const handleThis = (
    postId: string,
    parentCommentId: string | undefined,
    id: string
  ) => {
    if (areTheseReplies && parentCommentId) {
      navigate(`/reply/${postId}/${parentCommentId}/${id}`, {
        replace: true,
      });
      window.location.reload();
    }
  };

  return (
    <div className="">
      {comments.length < 1 ? (
        <p>No comments</p>
      ) : (
        comments.map(
          ({
            id,
            content,
            postId,
            likes,
            author,
            createdAt,
            replies,
            authorId,
            parentCommentId,
          }) => (
            <div key={id} className="border p-4">
              <div className="flex flex-col space-y-1">
                <Link
                  to={`/${author.username}`}
                  // to={`/`}
                  className="flex items-center space-x-3"
                >
                  <User user={author} />
                </Link>
                {/* <Link to={`/comment/${postId}/${id}`}> */}
                <Link
                  to={
                    areTheseReplies
                      ? `/reply/${postId}/${parentCommentId}/${id}`
                      : `/comment/${postId}/${id}`
                  }
                  onClick={() => handleThis(postId, parentCommentId, id)}
                >
                  <p>{content}</p>
                  <span className="text-gray-500 text-sm">
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                </Link>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Reply comments={replies} />
                  <Like commentId={id} likes={likes} />
                  <Bookmark commentId={id} />
                </div>
                {user?.id === authorId && (
                  <span
                    onClick={(e) => handleDelete(postId, id, e)}
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
    </div>
  );
};
