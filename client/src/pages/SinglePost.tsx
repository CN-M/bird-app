import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Comment } from "../components/Comment";
import { Post } from "../components/Post";
import { ReplyInput } from "../components/ReplyInput";
import { rootURL } from "../lib/utils";
import { PostType } from "../types";

export const SinglePost = () => {
  const { username, postId } = useParams();

  const [post, setPost] = useState<PostType>();
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

        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getSinglePost();
  }, []);
  return (
    <div className="border flex flex-col justify-start h-screen lg:w-1/4 md:w-1/2">
      {isLoading ? (
        <p>Loading post...</p>
      ) : (
        <>
          {!post ? (
            <p>Post does not exist</p>
          ) : (
            <>
              <Post post={post} />
              <ReplyInput postId={post.id} />
              <div className="flex-grow overflow-y-auto">
                <Comment replies={false} comments={post.comments} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
