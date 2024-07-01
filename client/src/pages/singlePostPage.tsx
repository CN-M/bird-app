import { useParams } from "react-router-dom";
import { SinglePostComponent } from "../components/singlePost";

export const SinglePost = () => {
  const { userId, postId } = useParams();
  return (
    <>
      <p>Single Post Page</p>
      <p>User ID{userId}</p>
      <p>Post ID {postId}</p>
      <SinglePostComponent userId={userId!} postId={postId!} />
    </>
  );
};
