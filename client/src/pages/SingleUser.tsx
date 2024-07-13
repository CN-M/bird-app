import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Follow } from "../components/Follow";
import { MainLayout } from "../components/MainLayout";
import { SingleUserFeed } from "../components/SingleUserFeed";
import { User } from "../components/User";
import { rootURL } from "../lib/utils";
import { UserType } from "../types";

// interface UserDetails extends UserType {
//   posts: PostType[];
// }

export const SingleUser = () => {
  const { username } = useParams();

  // const [user, setUser] = useState<UserDetails>();
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
    <MainLayout>
      {isLoading ? (
        <p>Loading user...</p>
      ) : (
        <>
          {!user ? (
            <p>User does not exist</p>
          ) : (
            <>
              <div className="p-5 flex justify-between border-b">
                <User user={user} />
                <Follow followingId={user.id} />
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
