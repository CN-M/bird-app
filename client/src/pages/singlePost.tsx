import { useParams } from "react-router-dom";
import { SinglePostComponent } from "../components/singlePost";

export const SinglePost = () => {
  const { username, postId } = useParams();
  return (
    <>
      <SinglePostComponent username={username!} postId={postId!} />
    </>
  );
};
