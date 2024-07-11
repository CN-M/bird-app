import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { Follow } from "../types";

type FollowRelationship = {
  following: boolean;
  message: string;
  followData?: Follow;
};

export const FollowComp = ({ followingId }: { followingId: string }) => {
  const [relationship, setRelationship] = useState<FollowRelationship>();
  const [isLoading, setIsLoading] = useState(false);

  const [following, setFollowing] = useState(relationship?.following);
  console.log(following);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const getFollowRelationship = async () => {
      try {
        const response = await axios.post(
          `${rootURL}/user/relationship`,
          { followingId },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${user?.accessToken}` },
          }
        );

        const { data }: { data: FollowRelationship } = response;

        setRelationship(data);
        setFollowing(data.following);

        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getFollowRelationship();
  }, []);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      await axios.post(
        `${rootURL}/user/follow`,
        { followingId },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      setIsLoading(false);
      setFollowing(true);
    } catch (err) {
      console.error("Error", err);
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setIsLoading(true);

    try {
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated or token not available.");
      }

      await axios.delete(`${rootURL}/user/unfollow`, {
        data: { followingId },
        withCredentials: true,
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setIsLoading(false);
      setFollowing(false);
    } catch (err) {
      console.error("Error", err);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : following ? (
        <button
          className="bg-indigo-500 rounded-lg px-5 py-2 text-white"
          onClick={handleUnfollow}
          disabled={isLoading}
        >
          {isLoading ? "Unfollowing..." : "Unfollow"}
        </button>
      ) : (
        <button
          className="bg-emerald-500 rounded-lg px-5 py-2 text-white"
          onClick={handleFollow}
          disabled={isLoading}
        >
          {isLoading ? "Following..." : "Follow"}
        </button>
      )}
    </div>
  );
};
