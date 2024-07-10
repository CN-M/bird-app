import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SingleUserFeed } from "../components/singleUserFeed";
import { UserComp } from "../components/user";
import { rootURL } from "../lib/utils";
import { Post, User } from "../types";

interface UserDetails extends User {
  posts: Post[];
}

export const SingleUserPage = () => {
  const { username } = useParams();

  const [user, setUser] = useState<UserDetails>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSingleUser = async () => {
      try {
        console.log(username);

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
    <>
      {isLoading ? (
        <p>Loading user...</p>
      ) : (
        <>
          {!user && <p>User does not exist</p>}
          {user && (
            <>
              <UserComp user={user} />
              <SingleUserFeed userPosts={user.posts} />
            </>
          )}
        </>
      )}
    </>
  );
};
