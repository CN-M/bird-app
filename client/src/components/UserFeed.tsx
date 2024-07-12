import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { PostType } from "../types";
import { Post } from "./Post";

export const UserFeed = () => {
  const [feedPosts, setFeedPosts] = useState<PostType[]>([]);
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

  if (!user) {
    return <p>Log in to see your feed</p>;
  }

  return (
    <>
      {isLoading && user ? (
        <p>Loading posts...</p>
      ) : (
        <>
          {feedPosts?.length < 1 ? (
            <p>Start following people to see their posts!</p>
          ) : (
            feedPosts.map((post) => <Post key={post.id} post={post} />)
          )}
        </>
      )}
    </>
  );
};
