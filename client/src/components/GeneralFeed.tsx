import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { PostType } from "../types";
import { Post } from "./Post";

export const GeneralFeed = ({
  generalFeedPosts,
  userFeedPosts,
  setGeneralFeedPosts,
  setUserFeedPosts,
  isLoading,
}: {
  generalFeedPosts: PostType[];
  userFeedPosts: PostType[];
  setGeneralFeedPosts: Dispatch<SetStateAction<PostType[]>>;
  setUserFeedPosts: Dispatch<SetStateAction<PostType[]>>;
  isLoading: boolean;
}) => {
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      !loadingMore &&
      !isLoading
    ) {
      loadMorePosts();
    }
  };

  const loadMorePosts = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const newPosts: PostType[] = []; // Simulate or fetch more posts here
      setGeneralFeedPosts((prev) => [...prev, ...newPosts]);
      setLoadingMore(false);
    }, 1000);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loadingMore, isLoading]);

  return (
    <div ref={containerRef}>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : generalFeedPosts.length < 1 ? (
        <p>No posts found</p>
      ) : (
        generalFeedPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            setGeneralFeedPosts={setGeneralFeedPosts}
            setUserFeedPosts={setUserFeedPosts}
            generalPosts={userFeedPosts}
            userPosts={generalFeedPosts}
          />
        ))
      )}
      {loadingMore && <p>Loading more posts...</p>}
    </div>
  );
};
