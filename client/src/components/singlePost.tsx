import axios from "axios";
import { useEffect, useState } from "react";
import { rootURL } from "../lib/utils";

export const SinglePostComponent = ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) => {
  const [post, setPost] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSingleUserFeed = async () => {
      try {
        const response = await axios.get(
          `${rootURL}/posts/${userId}/${postId}`,
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

    getSingleUserFeed();
  });
  return (
    <>
      <p>Posts By User Feed</p>
    </>
  );
};
