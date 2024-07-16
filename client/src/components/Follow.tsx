import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { FollowType } from "../types";

type FollowRelationshipType = {
  following: boolean;
  message: string;
  followData?: FollowType;
};

export const Follow = ({ followingId }: { followingId: string }) => {
  const [relationship, setRelationship] = useState<FollowRelationshipType>();
  const [isLoading, setIsLoading] = useState(false);

  const [following, setFollowing] = useState(relationship?.following);

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

        const { data }: { data: FollowRelationshipType } = response;

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
    const isFollowing = following ? false : true;
    setFollowing(isFollowing);

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
    } catch (err) {
      console.error("Error", err);

      setFollowing(!following);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    const isFollowing = following ? false : true;
    setFollowing(isFollowing);

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
    } catch (err) {
      console.error("Error", err);

      setFollowing(!following);
    } finally {
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
          // onClick={handleFollow}
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
