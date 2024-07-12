import axios from "axios";
import { useEffect, useState } from "react";
import { rootURL } from "../lib/utils";
import { Tweet } from "./Tweet";

import { Post } from "../types";

export const SingleUserFeed = ({ username }: { username: string }) => {
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSingleUserFeed = async () => {
      try {
        const response = await axios.get(`${rootURL}/posts/${username}/feed`, {
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

    getSingleUserFeed();
  }, []);
  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="text-xl font-bold mb-4">@{username}'s Posts</h2>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : (
        <>
          {feedPosts?.length < 1 ? (
            <p>No posts to display</p>
          ) : (
            feedPosts?.map((post) => <Tweet key={post.id} post={post} />)
          )}
        </>
      )}
    </div>
  );
};
