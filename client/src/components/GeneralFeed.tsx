import { Dispatch, SetStateAction } from "react";
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
  return (
    <>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : (
        <>
          {generalFeedPosts.length < 1 ? (
            <p>No one has posted anything</p>
          ) : (
            generalFeedPosts.map((post) => (
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
