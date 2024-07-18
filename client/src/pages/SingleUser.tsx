import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Follow } from "../components/Follow";
import { MainLayout } from "../components/MainLayout";
import { SingleUserFeed } from "../components/SingleUserFeed";
import { User } from "../components/User";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { UserType } from "../types";

export const SingleUser = () => {
  const { username } = useParams();

  const currentUser = useAuthStore((state) => state.user);

  const [user, setUser] = useState<UserType>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const getSingleUser = async () => {
      try {
        const response = await axios.get(`${rootURL}/user/${username}`, {
          withCredentials: true,
        });

        const { data } = response;

        setUser(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getSingleUser();
  }, []);

  return (
    <MainLayout classNames="lg:w-1/4">
      {isLoading ? (
        <p>Loading user...</p>
      ) : (
        <>
          {!user ? (
            <p>User does not exist</p>
          ) : (
            <>
              <div className="p-5 flex flex-col border-b">
                <div className="flex justify-between items-center">
                  <User user={user} />
                  {user.id === currentUser?.id ? (
                    <div></div>
                  ) : (
                    <Follow followingId={user.id} />
                  )}
                </div>

                {/* Bio and stats section */}
                <div className="mt-4">
                  <p className="text-xl font-semibold">{user.profileName}</p>
                  <p className="text-gray-600 mt-1">{user.bio}</p>
                  <div className="flex mt-2 space-x-4">
                    <span className="text-gray-800 font-semibold">
                      {user.followers.length} Followers
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {user.following.length} Following
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col h-full">
                <div className="flex justify-around border-b">
                  <button
                    className={`p-4 transition-colors duration-300 ${activeTab === "posts" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"}`}
                    onClick={() => setActiveTab("posts")}
                  >
                    Posts
                  </button>
                  <button
                    className={`p-4 transition-colors duration-300 ${activeTab === "likes" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"}`}
                    onClick={() => setActiveTab("likes")}
                  >
                    Likes
                  </button>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                  {activeTab === "posts" && (
                    <SingleUserFeed username={username!} />
                  )}
                  {/* Fix this later */}
                  {activeTab === "likes" && (
                    <SingleUserFeed username={username!} />
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </MainLayout>
  );
};
