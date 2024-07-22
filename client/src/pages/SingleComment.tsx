import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuthStore } from "../lib/authStore";

import { Comment } from "../components/Comment";
import { MainLayout } from "../components/MainLayout";
import { ReplyInput } from "../components/ReplyInput";
import { rootURL } from "../lib/utils";
import { CommentType } from "../types";

import { Link } from "react-router-dom";

import { FaTrash } from "react-icons/fa";
import { Like } from "../components/Like";
import { Reply } from "../components/Reply";
import { User } from "../components/User";

export const SingleComment = () => {
  const { postId, commentId } = useParams();

  const user = useAuthStore((state) => state.user);

  let route: string;

  route = `/${postId}/${commentId}`;

  // if (replyId) {
  // route = `/${postId}/${commentId}/${replyId}`;
  // } else if (postId && commentId) {
  // }

  const [comment, setComment] = useState<CommentType>();
  const [replies, setReplies] = useState<CommentType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const getSingleComment = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          // `${rootURL}/comments/${postId}/${commentId}`,
          `${rootURL}/comments/${route}`,
          {
            withCredentials: true,
          }
        );

        const { data } = response;

        setComment(data);
        setReplies(data.replies);
        console.log(data);
        console.log(data.replies);

        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getSingleComment();
  }, []);

  const handleDelete = async (
    postId: string,
    commentId: string,
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();

    setIsLoading(true);
    setIsDeleted(true);

    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      // console.log(`${rootURL}/comments/${postId}/${commentId}`);
      await axios.delete(`${rootURL}/comments/${postId}/${commentId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (err) {
      console.error("Error", err);
      setIsDeleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      {isLoading ? (
        <p>Loading comment...</p>
      ) : (
        <>
          {!comment && <p>Comment does not exist</p>}

          {comment && replies && (
            <>
              <div key={comment.id} className="border p-4">
                <div className="flex flex-col space-y-1">
                  <Link
                    to={`/${comment.author.username}`}
                    // to={`/`}
                    className="flex items-center space-x-3"
                  >
                    <User user={comment.author} />
                  </Link>
                  <>
                    {isDeleted ? (
                      <p>Comment has been deleted</p>
                    ) : (
                      <>
                        <Link
                          to={
                            `/comment/${postId}/${comment.id}`
                            // ? `/reply/${postId}/${comment.parentCommentId}/${comment.id}`
                          }
                        >
                          <p>{comment.content}</p>
                          <span className="text-gray-500 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </Link>
                        <div className="flex justify-between w-full mt-2">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Reply comments={replies} />
                            <Like
                              commentId={comment.id}
                              likes={comment.likes}
                            />
                          </div>
                          {user?.id === comment.authorId && (
                            <span
                              onClick={(e) =>
                                handleDelete(comment.postId, comment.id, e)
                              }
                              aria-disabled={isLoading}
                              className="flex items-center justify-center gap-1 hover:bg-gray-500/25 hover:text-gray-500 rounded-full px-2 cursor-pointer"
                            >
                              <FaTrash className="size-5" />
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </>
                </div>
              </div>
              <ReplyInput
                postComments={replies}
                setPostComments={setReplies}
                post={comment.post}
                postId={postId ? postId : ""}
                parentCommentId={commentId}
              />
              <Comment
                areTheseReplies={true}
                setReplies={setReplies}
                comments={replies}
              />
            </>
          )}
        </>
      )}
    </MainLayout>
  );
};
