import { Link } from "react-router-dom";
import { Comment } from "../types";

export const CommentComp = ({ comments }: { comments: Comment[] }) => {
  return (
    <div className="space-y-1">
      {comments?.length < 1 ? (
        <p></p>
      ) : (
        <>
          {comments?.map(({ id, content, postId }) => (
            <div className="border border-indigo-800">
              <Link key={id} to={`/comment/${postId}/${id}`}>
                <p>{content}</p>
              </Link>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
