import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FollowComp } from "../components/followBtn";
import { SingleUserFeed } from "../components/singleUserFeed";
import { UserComp } from "../components/user";
import { rootURL } from "../lib/utils";
import { Post, User } from "../types";

interface UserDetails extends User {
  posts: Post[];
}

export const SingleUser = () => {
  const { username } = useParams();

  const [user, setUser] = useState<UserDetails>();
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="p-5">
      {isLoading ? (
        <p>Loading user...</p>
      ) : (
        <>
          {!user ? (
            <p>User does not exist</p>
          ) : (
            <>
              <UserComp user={user} />
              <div className="mt-3">
                <FollowComp followingId={user.id} />
              </div>
              <div className="mt-5">
                {/* Fix this later */}
                <SingleUserFeed username={username!} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
