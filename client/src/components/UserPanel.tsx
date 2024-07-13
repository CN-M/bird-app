import {
  // FaBell,
  FaBookmark,
  // FaCog,
  FaEnvelope,
  FaHome,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export const UserPanel = () => {
  return (
    <div className="sticky border top-4 p-4 bg-white rounded-3xl shadow-md">
      <h2 className="text-xl font-bold mb-4 hidden lg:block">Menu</h2>
      <div className="flex flex-col space-y-4">
        <Link
          to={"/"}
          className="flex items-center space-x-2 hover:text-blue-500"
        >
          <FaHome className="size-7 text-xl" />
          <span className="hidden lg:inline text-xl text-black/75 ">Home</span>
        </Link>
        <Link
          to={"/messages"}
          className="flex items-center space-x-2 hover:text-blue-500"
        >
          <FaEnvelope className="size-7 text-xl" />
          <span className="hidden lg:inline text-xl text-black/75 ">
            Messages
          </span>
        </Link>
        <Link
          to={"/bookmarks"}
          className="flex items-center space-x-2 hover:text-blue-500"
        >
          <FaBookmark className="size-7 text-xl" />
          <span className="hidden lg:inline text-xl text-black/75 ">
            Bookmarks
          </span>
        </Link>
        <Link
          to={"/premium"}
          className="flex items-center space-x-2 hover:text-blue-500"
        >
          <FaStar className="size-7 text-xl" />
          <span className="hidden lg:inline text-xl text-black/75 ">
            Premium
          </span>
        </Link>
        <Link
          to={"/profile"}
          className="flex items-center space-x-2 hover:text-blue-500"
        >
          <FaUser className="size-7 text-xl" />
          <span className="hidden lg:inline text-xl text-black/75 ">
            Profile
          </span>
        </Link>
        {/* <Link
          to={"/notifications"}
          className="flex items-center space-x-2 hover:text-blue-500"
        >
          <FaBell className="size-7 text-xl" />
          <span className="hidden lg:inline text-xl text-black/75 ">
            Notifications
          </span>
        </Link>
        <Link
          to={"/settings"}
          className="flex items-center space-x-2 hover:text-blue-500"
        >
          <FaCog className="size-7 text-xl" />
          <span className="hidden lg:inline text-xl text-black/75 ">
            Settings
          </span>
        </Link> */}
      </div>
    </div>
  );
};
