import axios from "axios";
import { useEffect, useState } from "react";
import { rootURL } from "../lib/utils";
import { Post } from "../types";
import { Tweet } from "./Tweet";

export const GeneralFeed = () => {
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getGeneralFeed = async () => {
      try {
        const response = await axios.get(`${rootURL}/posts`, {
          withCredentials: true,
        });

        const { data } = response;

        setFeedPosts(data);

        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getGeneralFeed();
  }, []);
  return (
    <>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : (
        <>
          {feedPosts.length < 1 ? (
            <p>No posts to display</p>
          ) : (
            feedPosts.map((post) => <Tweet key={post.id} post={post} />)
          )}
        </>
      )}
    </>
  );
};
