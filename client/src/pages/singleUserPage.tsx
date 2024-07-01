import { useParams } from "react-router-dom";
import { SingleUserFeed } from "../components/singleUserFeed";

export const SingleUserPage = () => {
  const { userId } = useParams();

  return (
    <>
      <p>Single User Page of {userId}</p>
      <SingleUserFeed userId={userId!} />
    </>
  );
};
