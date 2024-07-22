import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { PostType } from "../types";

export const PostInput = ({
  generalFeedPosts,
  userFeedPosts,
  setUserFeedPosts,
  setGeneralFeedPosts,
}: {
  generalFeedPosts: PostType[];
  userFeedPosts: PostType[];
  setUserFeedPosts: Dispatch<SetStateAction<PostType[]>>;
  setGeneralFeedPosts: Dispatch<SetStateAction<PostType[]>>;
}) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  // @ts-ignore
  const handlePost = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const genFeed = [...generalFeedPosts];
    const userFeed = [...userFeedPosts];

    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      const tempId = uuidv4();

      const newPost: PostType = {
        id: tempId,
        author: user,
        authorId: user.id,
        comments: [],
        content,
        createdAt: Date.now(),
        likes: [],
        updatedAT: Date.now(),
        bookmarks: [],
      };

      setGeneralFeedPosts([newPost, ...genFeed]);
      setUserFeedPosts([newPost, ...userFeed]);

      const res = await axios.post(
        `${rootURL}/posts`,
        { content },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      const actualId = res.data.id;
      // Replace the temporary ID with the actual ID in the state
      setGeneralFeedPosts((prev) =>
        prev.map((post) =>
          post.id === tempId ? { ...post, id: actualId } : post
        )
      );
      setUserFeedPosts((prev) =>
        prev.map((post) =>
          post.id === tempId ? { ...post, id: actualId } : post
        )
      );

      setContent("");
    } catch (err) {
      console.error("Error", err);
      setGeneralFeedPosts(genFeed);
      setUserFeedPosts(userFeed);
    } finally {
      setIsLoading(false);
    }
  };

  // @ts-ignore
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className="border-b p-4 flex">
      <form className="flex flex-col w-full space-y-2" onSubmit={handlePost}>
        <textarea
          onChange={handleChange}
          value={content}
          placeholder="What's on your mind?"
          className="border-2 resize-none border-emerald-500 rounded-md w-full h-20 p-2 focus:border-blue-500 focus:outline-none focus:ring-0"
          minLength={1}
          maxLength={280}
          required
        />
        <div className="flex justify-end">
          <button
            className="bg-blue-500 py-2 px-4 rounded-full text-white hover:bg-blue-600 transition-colors duration-300"
            disabled={isLoading}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
