import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Comment } from "../components/Comment";
import { MainLayout } from "../components/MainLayout";
import { ReplyInput } from "../components/ReplyInput";
import { rootURL } from "../lib/utils";
import { CommentType } from "../types";

export const SingleReply = () => {
  const { postId, commentId, replyId } = useParams();

  // let route: string;

  // route = `/${postId}/${commentId}/${replyId}`;
  // route = `/${postId}/${commentId}`;

  const [reply, setReply] = useState<CommentType>();
  const [replies, setReplies] = useState<CommentType[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSingleComment = async () => {
      try {
        const response = await axios.get(
          `${rootURL}/comments/${postId}/${commentId}/${replyId}`,
          // `${rootURL}/comments/${route}`,
          {
            withCredentials: true,
          }
        );

        const { data } = response;

        setReply(data);
        setReplies(data.replies);

        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getSingleComment();
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <p>Loading comment...</p>
      ) : (
        <>
          {!reply && <p>Reply does not exist</p>}
          {reply && (
            <>
              <Comment areTheseReplies={true} comments={[reply]} />
              <ReplyInput
                postId={postId ? postId : ""}
                parentCommentId={replyId}
                postComments={replies}
                setPostComments={setReplies}
                post={reply.post}
              />
              <Comment
                areTheseReplies={true}
                comments={replies ? replies : reply.replies}
              />
            </>
          )}
        </>
      )}
    </MainLayout>
  );
};
