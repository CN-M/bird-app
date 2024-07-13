import { useState } from "react";
import { GeneralFeed } from "../components/GeneralFeed";
import { MainLayout } from "../components/MainLayout";
import { PostInput } from "../components/PostInput";
import { UserFeed } from "../components/UserFeed";

export const Main = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <MainLayout>
      <PostInput />
      <div className="flex flex-col h-full">
        <div className="flex justify-around border-b">
          <button
            className={`p-4 transition-colors duration-300 ${activeTab === "general" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"}`}
            onClick={() => setActiveTab("general")}
          >
            General Feed
          </button>
          <button
            className={`p-4 transition-colors duration-300 ${activeTab === "user" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"}`}
            onClick={() => setActiveTab("user")}
          >
            Following
          </button>
        </div>
        <div className="p-4 flex-grow overflow-y-auto">
          {activeTab === "general" && <GeneralFeed />}
          {activeTab === "user" && <UserFeed />}
        </div>
      </div>
    </MainLayout>
  );
};
