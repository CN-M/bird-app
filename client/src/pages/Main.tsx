import { GeneralFeed } from "../components/generalFeed";
import { PostInput } from "../components/postInput";
import { UserFeed } from "../components/userFeed";

export const Main = () => {
  return (
    <>
      <div className="border flex flex-col h-h-full justify-between">
        <PostInput />
        <div className="h-full">
          <GeneralFeed />
          <UserFeed />
        </div>
      </div>
    </>
  );
};
