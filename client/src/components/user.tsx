import { Link } from "react-router-dom";
import { User } from "../types";

export const UserComp = ({ user }: { user: User }) => {
  const { isPremium, profileName, username, profilePicture } = user;
  return (
    <Link to={`/${username}`}>
      <div className="flex flex-col space-x-1 border border-indigo-500 rounded-lg px-5 py-2 space-y-1">
        <div className="flex items-center space-x-1">
          <img
            className="h-8 w-8 border rounded-full"
            src={profilePicture}
            alt={`${username}`}
          />
          <p>{profileName}</p>
        </div>
        <div className="flex items-center space-x-1">
          <p>{username}</p>
          <p className="text-sky-700 font-bold">{isPremium ? "Premium" : ""}</p>
        </div>
      </div>
    </Link>
  );
};
