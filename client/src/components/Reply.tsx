import { FaRegComment } from "react-icons/fa";
import { CommentType } from "../types";

export const Reply = ({ comments }: { comments: CommentType[] }) => {
  return (
    <span className="flex items-center justify-center gap-1 hover:bg-blue-500/25 hover:text-blue-500 rounded-full px-2 cursor-pointer">
      {comments.length}
      <FaRegComment className="size-5" />
    </span>
  );
};
