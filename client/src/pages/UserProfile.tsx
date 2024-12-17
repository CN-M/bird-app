import axios from "axios";
import { useEffect, useState } from "react";
import { MainLayout } from "../components/MainLayout";
import { Modal } from "../components/Modal"; // Assuming you have a modal component
import { SingleUserFeed } from "../components/SingleUserFeed";
import { User } from "../components/User";
import { useAuthStore } from "../lib/authStore"; // Assumes you have an auth store
import { rootURL } from "../lib/utils"; // Assumes you have a utils file for common variables

export const UserProfile = () => {
  const user = useAuthStore((state) => state.user);

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username,
    profileName: user?.profileName,
    bio: user?.bio || "I don't have a bio because I'm a dumb new user!", // Default bio value
    profilePicture: user?.profilePicture,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // Default active tab is 'posts'
  // const [likedPosts, setLikedPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Fetch user data (posts, liked posts, followers, following)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [postsRes, likedPostsRes, userRes] = await Promise.all([
        const [userRes] = await Promise.all([
          // axios.get(`${rootURL}/users/${user?.id}/liked-posts`, {
          //   headers: { Authorization: `Bearer ${user?.accessToken}` },
          // }),
          axios.get(`${rootURL}/user/${user?.username}`, {
            headers: { Authorization: `Bearer ${user?.accessToken}` },
          }),
        ]);

        // setLikedPosts(likedPostsRes.data);

        setFollowersCount(userRes.data.followers.length);
        setFollowingCount(userRes.data.following.length);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (user?.id) fetchData();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${rootURL}/user/${user?.username}/edit`, profileData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
      setIsLoading(false);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setIsLoading(false);
    }
  };

  return (
    <MainLayout classNames="lg:w-1/4">
      {user ? (
        <>
          <div className="p-5 flex flex-col border-b">
            <div className="p-5 flex flex-col">
              <div className="flex justify-between items-center">
                <User user={user} />
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 py-2 px-4 rounded-md text-white hover:bg-blue-600 transition-colors duration-300"
                >
                  Edit Profile
                </button>
              </div>

              {/* Bio and stats section */}
              <div className="mt-4">
                <p className="text-xl font-semibold">{user.profileName}</p>
                <p className="text-gray-600 mt-1">{profileData.bio}</p>
                <div className="flex mt-2 space-x-4">
                  <span className="text-gray-800 font-semibold">
                    {followersCount} Followers
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {followingCount} Following
                  </span>
                </div>
              </div>
            </div>
          </div>

          {editMode && (
            <Modal onClose={() => setEditMode(false)}>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
                <div>
                  <label className="block text-gray-700">Profile Name</label>
                  <input
                    type="text"
                    name="profileName"
                    value={profileData.profileName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:border-blue-500 focus:ring-0 focus:outline-none"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:border-blue-500 focus:ring-0 focus:outline-none"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 py-2 px-4 rounded-full text-white hover:bg-blue-600 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* Tabs for Posts and Liked Posts */}
          <div className="flex flex-col h-full">
            <div className="flex justify-around border-b">
              <button
                className={`p-4 transition-colors duration-300 ${activeTab === "posts" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"}`}
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
              <button
                className={`p-4 transition-colors duration-300 ${activeTab === "likes" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"}`}
                onClick={() => setActiveTab("likes")}
              >
                Likes
              </button>
            </div>
            <div className="p-4 flex-grow overflow-y-auto">
              {activeTab === "posts" && (
                <SingleUserFeed username={user?.username} />
              )}
              {/* Fix this later */}
              {activeTab === "likes" && (
                <SingleUserFeed username={user?.username} />
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Login to edit your profile</p>
      )}
    </MainLayout>
  );
};
