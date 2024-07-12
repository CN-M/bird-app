import axios from "axios";
import { useAuthStore } from "../lib/authStore";

import { useState } from "react";
import { rootURL } from "../lib/utils";

export const PostInput = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  // @ts-ignore
  const handlePost = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      await axios.post(
        `${rootURL}/posts`,
        { content },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      setIsLoading(false);
      setContent("");
    } catch (err) {
      console.error("Error", err);
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
          className="border-2 border-emerald-500 rounded-md w-full h-20 p-2 focus:border-blue-500 focus:outline-none focus:ring-0"
          minLength={1}
          maxLength={280}
          required
        />
        <div className="flex justify-end">
          <button
            className="bg-blue-500 py-2 px-4 rounded-full text-white hover:bg-blue-600 transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};
