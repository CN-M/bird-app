import { useParams } from "react-router-dom";

export const UserProfile = () => {
  const { userId } = useParams();

  return (
    <>
      <p>User Profile Page of {userId}</p>
    </>
  );
};
