import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CommentComp } from "../components/Comment";
import { rootURL } from "../lib/utils";
import { Comment } from "../types";

export const SingleComment = () => {
  const { postId, commentId } = useParams();

  const [comment, setComment] = useState<Comment>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSingleComment = async () => {
      try {
        const response = await axios.get(
          `${rootURL}/comments/${postId}/${commentId}`,
          {
            withCredentials: true,
          }
        );

        const { data } = response;

        setComment(data);
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
              <CommentComp comments={[comment]} />
            </>
          )}
        </>
      )}
    </div>
  );
};
