import axios from "axios";
import { useEffect, useState } from "react";
import { rootURL } from "../lib/utils";
import { Post } from "../types";
import { CommentComp } from "./comment";
import { Tweet } from "./tweet";

export const SinglePostComponent = ({
  username,
  postId,
}: {
  username: string;
  postId: string;
}) => {
  const [post, setPost] = useState<Post>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSinglePost = async () => {
      try {
        const response = await axios.get(
          `${rootURL}/posts/${username}/${postId}`,
          {
            withCredentials: true,
          }
        );

        const { data } = response;

        setPost(data);
        console.log(data);

        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getSinglePost();
  }, []);
  return (
    <div className="p-5">
      {isLoading ? (
        <p>Loading post...</p>
      ) : (
        <>
          {!post ? (
            <p>Post does not exist</p>
          ) : (
            <>
              <Tweet post={post} />
              <div className="mt-5">
                <CommentComp comments={post.comments} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
