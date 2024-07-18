import axios from "axios";
import { useState } from "react";
import { MainLayout } from "../components/MainLayout";
import { useAuthStore } from "../lib/authStore"; // Assumes you have an auth store
import { rootURL } from "../lib/utils"; // Assumes you have a utils file for common variables

export const UserProfile = () => {
  const user = useAuthStore((state) => state.user);

  const bio = "I'm great";

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username,
    profileName: user?.profileName,
    // bio: user?.bio,
    bio: bio,
    profilePicture: user?.profilePicture,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${rootURL}/users/${user?.id}`, profileData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
      // Update user information in the auth store or state management
      // Example: useAuthStore.getState().updateUser(profileData);
      setIsLoading(false);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      {user ? (
        <div className="p-4">
          <div className="flex items-center space-x-4">
            {user?.profilePicture ? (
              <img
                className="w-20 h-20 border border-emerald-500 rounded-full"
                src={user?.profilePicture}
                alt={`@${user?.username}`}
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center border rounded-full border-emerald-500">
                {user?.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">@{user?.username}</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-blue-500 py-2 px-4 rounded-full text-white hover:bg-blue-600 transition-colors duration-300"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
          {editMode ? (
            <div className="mt-4 space-y-4">
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
              <div>
                <label className="block text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:border-blue-500 focus:ring-0 focus:outline-none"
                />
              </div>
              <button
                onClick={handleSave}
                className="bg-blue-500 py-2 px-4 rounded-full text-white hover:bg-blue-600 transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-gray-700">
                <strong>Profile Name:</strong> {user?.profileName}
              </p>
              <p className="text-gray-700">
                {/* <strong>Bio:</strong> {user?.bio} */}
                <strong>Bio:</strong> {bio}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p>Login to edit your profile</p>
      )}
    </MainLayout>
  );
};
