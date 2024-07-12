import { useParams } from "react-router-dom";

export const UserProfile = () => {
  const { username } = useParams();

  return (
    <>
      <p>User Profile Page of {username}</p>
    </>
  );
};
