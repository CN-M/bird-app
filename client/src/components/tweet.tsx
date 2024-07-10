import { Link } from "react-router-dom";
import { Post } from "../types";
import { UserComp } from "./user";

export const Tweet = ({ post }: { post: Post }) => {
  const { id, author, content, createdAt } = post;
  const { username } = author;
  return (
    <Link to={`/${username}/${id}`}>
      <div className="flex flex-col items-center border-2 border-emerald-500 p-5 rounded-lg">
        <UserComp user={author} />
        <div className="flex flex-col space-y-1">
          <p>{content}</p>
          <p>Date: {createdAt}</p>
        </div>
      </div>
    </Link>
  );
};
