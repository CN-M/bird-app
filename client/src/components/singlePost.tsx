import axios from "axios";
import { useEffect, useState } from "react";
import { rootURL } from "../lib/utils";
import { Post } from "../types";
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
    <>
      {isLoading ? (
        <p>Loading post...</p>
      ) : (
        <>
          {!post && <p>User does not exist</p>}
          {post && <Tweet post={post} />}
        </>
      )}
    </>
  );
};
