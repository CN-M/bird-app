import axios from "axios";
import { useState } from "react";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";

export const Follow = ({ followingId }: { followingId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      await axios.post(
        `${rootURL}/user/follow`,
        { followingId },
        { withCredentials: true }
      );
      setIsLoading(false);
      console.log(followingId);
    } catch (err) {
      console.error("Error", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-emerald-500 rounded-lg px-5 py-2">
      <button className="" onClick={() => handleFollow()} disabled={isLoading}>
        {isLoading ? "Following..." : "Follow"}
      </button>
    </div>
  );
};
