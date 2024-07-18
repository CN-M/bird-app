import axios from "axios";
import { GeneralFeed } from "../components/GeneralFeed";
import { MainLayout } from "../components/MainLayout";
import { PostInput } from "../components/PostInput";
import { UserFeed } from "../components/UserFeed";

import { useAuthStore } from "../lib/authStore";

import { useEffect, useState } from "react";
import { rootURL } from "../lib/utils";
import { PostType } from "../types";

const shuffleArray = (array: PostType[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const Main = () => {
  const [generalFeedPosts, setGeneralFeedPosts] = useState<PostType[]>([]);
  const [userFeedPosts, setUserFeedPosts] = useState<PostType[]>([]);

  const [isUserFeedLoading, setUserFeedIsLoading] = useState(false);
  const [isGeneralFeedLoading, setGeneralFeedIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const getGeneralFeed = async () => {
      setGeneralFeedIsLoading(true);
      try {
        const response = await axios.get(`${rootURL}/posts`, {
          withCredentials: true,
        });

        const { data } = response;

        // Shuffle the posts before setting them
        const shuffledPosts = shuffleArray(data);

        setGeneralFeedPosts(shuffledPosts);
        setGeneralFeedIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setGeneralFeedIsLoading(false);
      }
    };

    const getUserFeed = async () => {
      setUserFeedIsLoading(true);
      try {
        const response = await axios.get(`${rootURL}/posts/feed`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        });

        const { data } = response;

        // setUserFeedPosts(data.reverse());

        // Shuffle the posts before setting them
        const shuffledPosts = shuffleArray(data);
        setUserFeedPosts(shuffledPosts);

        setUserFeedIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setUserFeedIsLoading(false);
      }
    };

    getGeneralFeed();
    getUserFeed();
  }, []);

  const [activeTab, setActiveTab] = useState("general");

  return (
    <MainLayout classNames="lg:w-1/4">
      <PostInput
        generalFeedPosts={generalFeedPosts}
        userFeedPosts={userFeedPosts}
        setGeneralFeedPosts={setGeneralFeedPosts}
        setUserFeedPosts={setUserFeedPosts}
      />
      <div className="flex flex-col h-full">
        <div className="flex justify-around border-b">
          <button
            className={`p-4 transition-colors duration-300 ${activeTab === "general" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"}`}
            onClick={() => setActiveTab("general")}
          >
            General Feed
          </button>
          <button
            className={`p-4 transition-colors duration-300 ${activeTab === "user" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"}`}
            onClick={() => setActiveTab("user")}
          >
            Following
          </button>
        </div>
        <div className="p-4 flex-grow overflow-y-auto">
          {activeTab === "general" && (
            <GeneralFeed
              generalFeedPosts={generalFeedPosts}
              userFeedPosts={userFeedPosts}
              setGeneralFeedPosts={setGeneralFeedPosts}
              setUserFeedPosts={setUserFeedPosts}
              isLoading={isGeneralFeedLoading}
            />
          )}
          {activeTab === "user" && (
            <UserFeed
              userFeedPosts={userFeedPosts}
              generalFeedPosts={generalFeedPosts}
              setGeneralFeedPosts={setGeneralFeedPosts}
              setUserFeedPosts={setUserFeedPosts}
              isLoading={isUserFeedLoading}
              user={user}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};
