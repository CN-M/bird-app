import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Comment } from "../components/Comment";
import { ReplyInput } from "../components/ReplyInput";
import { rootURL } from "../lib/utils";
import { CommentType } from "../types";

export const SingleComment = () => {
  const { postId, commentId } = useParams();

  let route: string;

  route = `/${postId}/${commentId}`;
  // if (replyId) {
  // route = `/${postId}/${commentId}/${replyId}`;
  // } else if (postId && commentId) {
  // }

  const [comment, setComment] = useState<CommentType>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSingleComment = async () => {
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

        console.log(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getSingleComment();
  }, []);

  return (
    <div className="border flex flex-col justify-start h-screen lg:w-1/4 md:w-1/2">
      {isLoading ? (
        <p>Loading comment...</p>
      ) : (
        <>
          {!comment && <p>Comment does not exist</p>}
          {comment && (
            <>
              <Comment replies={true} comments={[comment]} />
              <ReplyInput postId={postId} parentCommentId={commentId} />
              <Comment replies={true} comments={comment.replies} />
            </>
          )}
        </>
      )}
    </div>
  );
};
