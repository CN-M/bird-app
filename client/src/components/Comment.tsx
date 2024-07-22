import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { useAuthStore } from "../lib/authStore";
// import { Link, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { FaTrash } from "react-icons/fa";
import { Like } from "./Like";
import { Reply } from "./Reply";
import { User } from "./User";

import { rootURL } from "../lib/utils";

import { CommentType } from "../types";

export const Comment = ({
  areTheseReplies,
  comments,
  setReplies,
}: {
  setReplies?: Dispatch<SetStateAction<CommentType[] | undefined>>;
  areTheseReplies: boolean;
  comments: CommentType[];
}) => {
  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (
    postId: string,
    commentId: string,
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();

    setIsLoading(true);

    const originalReplies = [...comments];

    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      const updatedReplies = originalReplies?.filter(
        (reply) => reply.id !== commentId
      );

      if (updatedReplies && setReplies) {
        setReplies(updatedReplies);
      }

      // console.log(`${rootURL}/comments/${postId}/${commentId}`);
      await axios.delete(`${rootURL}/comments/${postId}/${commentId}`, {
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
                {/* <Link */}
                <>
                  <a
                    href={
                      areTheseReplies
                        ? `/reply/${postId}/${parentCommentId}/${id}`
                        : `/comment/${postId}/${id}`
                    }
                    // onClick={() => handleThis(postId, parentCommentId, id)}
                  >
                    <p>{content}</p>
                    <span className="text-gray-500 text-sm">
                      {new Date(createdAt).toLocaleDateString()}
                    </span>
                    {/* </Link> */}
                  </a>
                  <div className="flex justify-between w-full mt-2">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Reply comments={replies} />
                      <Like commentId={id} likes={likes} />
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
                </>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};
