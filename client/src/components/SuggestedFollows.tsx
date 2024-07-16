import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { UserType } from "../types";
import { Follow } from "./Follow";
import { User } from "./User";

export const SuggestedFollows = () => {
  const [userSuggestions, setUserSuggestions] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const getUserFeed = async () => {
      try {
        const response = await axios.get(`${rootURL}/user/suggestions`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        });

        const { data } = response;

        setUserSuggestions(data);

        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getUserFeed();
  }, []);

  if (!user) {
    // return <p>Log in to see your feed</p>;
    return <div></div>;
  }

  return (
    <div className="sticky top-4 p-4 border bg-white rounded-3xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Who to follow</h2>
      {isLoading ? (
        <p>Fetching Users...</p>
      ) : (
        <div className="flex flex-col space-y-4">
          {userSuggestions?.length < 1 ? (
            <p>No new suggestions.</p>
          ) : (
            userSuggestions.map((user) => (
              <div key={user.id} className="flex justify-between">
                {/* <Link */}
                <a
                  href={`/${user.username}`}
                  className="flex items-center space-x-3"
                >
                  <User user={user} />
                  {/* </Link> */}
                </a>
                <Follow followingId={user.id} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
