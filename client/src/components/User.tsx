import { MdVerified } from "react-icons/md";
import { UserType } from "../types";

export const User = ({ user }: { user: UserType }) => {
  const { isPremium, profileName, username, profilePicture } = user;
  return (
    <div className="flex items-center space-x-3">
      {profilePicture ? (
        <img
          className="h-10 w-10 border border-emerald-500 rounded-full"
          src={profilePicture}
          alt={`@${username}`}
        />
      ) : (
        <div className="h-10 w-10 flex items-center justify-center border rounded-full border-emerald-500">
          {username.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex space-x-1 items-center">
        <p className="font-bold">{profileName}</p>
        {isPremium && (
          <span className="text-blue-500 font-bold">
            <MdVerified className="size-5" />
          </span>
        )}
        <p className="text-gray-500">@{username}</p>
      </div>
    </div>
  );
};
