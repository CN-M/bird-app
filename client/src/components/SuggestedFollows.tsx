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
  const [hasError, setHasError] = useState(false);

  const user = useAuthStore((state) => state.user);

  const fetchUserSuggestions = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await axios.get<UserType[]>(
        `${rootURL}/user/suggestions`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        }
      );

      setUserSuggestions(response.data);
    } catch (error) {
      console.error("Failed to fetch user suggestions:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserSuggestions();
    }
  }, [user]);

  if (!user) {
    return null; // User not logged in, render nothing
  }

  return (
    <div className="sticky top-4 p-4 border bg-white rounded-3xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Who to follow</h2>

      {isLoading && <p>Fetching users...</p>}

      {!isLoading && hasError && (
        <p className="text-red-500">
          Failed to load suggestions. Please try again.
        </p>
      )}

      {!isLoading && !hasError && (
        <div className="flex flex-col space-y-4">
          {userSuggestions.length === 0 ? (
            <p>No new suggestions.</p>
          ) : (
            userSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex justify-between">
                <a
                  href={`/${suggestion.username}`}
                  className="flex items-center space-x-3"
                >
                  <User user={suggestion} />
                </a>
                <Follow followingId={suggestion.id} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
