import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { Post } from "../types";
import { Tweet } from "./tweet";

export const UserFeed = () => {
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const getUserFeed = async () => {
      try {
        const response = await axios.get(`${rootURL}/posts/feed`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        });

        const { data } = response;

        setFeedPosts(data);

        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getUserFeed();
  }, []);
  return (
    <>
      {isLoading && user ? (
        <p>Loading posts...</p>
      ) : (
        <>
          {feedPosts?.length < 1 ? (
            <p>No posts to display</p>
          ) : (
            feedPosts.map((post) => <Tweet key={post.id} post={post} />)
          )}
        </>
      )}
    </>
  );
};
