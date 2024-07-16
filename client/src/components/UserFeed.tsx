import { Dispatch, SetStateAction } from "react";
import { PostType, UserType } from "../types";
import { Post } from "./Post";

export const UserFeed = ({
  generalFeedPosts,
  userFeedPosts,
  setGeneralFeedPosts,
  setUserFeedPosts,
  isLoading,
  user,
}: {
  generalFeedPosts: PostType[];
  userFeedPosts: PostType[];
  setGeneralFeedPosts: Dispatch<SetStateAction<PostType[]>>;
  setUserFeedPosts: Dispatch<SetStateAction<PostType[]>>;
  isLoading: boolean;
  user: UserType | null;
}) => {
  if (!user) {
    return <p>Log in to see your feed</p>;
  }

  return (
    <>
      {isLoading && user ? (
        <p>Loading posts...</p>
      ) : (
        <>
          {userFeedPosts?.length < 1 ? (
            <p>Start following people to see their posts!</p>
          ) : (
            userFeedPosts.map((post) => (
              <Post
                setGeneralFeedPosts={setGeneralFeedPosts}
                setUserFeedPosts={setUserFeedPosts}
                generalPosts={userFeedPosts}
                userPosts={generalFeedPosts}
                key={post.id}
                post={post}
              />
            ))
          )}
        </>
      )}
    </>
  );
};
