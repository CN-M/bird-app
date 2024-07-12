import { Link } from "react-router-dom";
import { Comment } from "../types";
// import { LikeComp } from "./like";
import { FaRegHeart } from "react-icons/fa";

export const CommentComp = ({ comments }: { comments: Comment[] }) => {
  return (
    <div className="space-y-4">
      {comments.length < 1 ? (
        <p>No comments</p>
      ) : (
        comments.map(({ id, content, postId, likes, author, createdAt }) => (
          <div key={id} className="border-t pt-4">
            <Link to={`/comment/${postId}/${id}`}>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-3">
                  <img
                    src={author.profilePicture}
                    alt={author.username}
                    className="h-8 w-8 rounded-full"
                  />
                  <p className="font-bold">{author.username}</p>
                </div>
                <p>{content}</p>
                <div className="flex justify-between text-gray-500">
                  <span className="text-sm">
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2 items-center">
                    <FaRegHeart className="size-5" />
                    <span>{likes.length}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};
