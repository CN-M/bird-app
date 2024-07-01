import axios from "axios";
import { useEffect, useState } from "react";
import { rootURL } from "../lib/utils";

export const FollowFeed = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFollowFeed = async () => {
      try {
        const response = await axios.get(`${rootURL}/posts/feed`, {
          withCredentials: true,
        });

        const { data } = response;

        setFeedPosts(data);
        console.log(data);

        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getFollowFeed();
  });

  return (
    <>
      <p>Follow Feed</p>
    </>
  );
};
