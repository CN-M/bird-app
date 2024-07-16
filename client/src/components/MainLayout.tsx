import { SuggestedFollows } from "./SuggestedFollows";
import { UserPanel } from "./UserPanel";

export const MainLayout = ({
  children,
  classNames,
}: {
  children: React.ReactNode;
  classNames?: string;
}) => {
  return (
    <div className="flex space-x-5 justify-center h-full w-full">
      {/* Sidebar container */}
      <div className="w-1/4 hidden lg:block">
        <UserPanel />
      </div>

      {/* Main content container */}
      <div
        className={`border flex flex-col justify-start lg:w-1/2 ${classNames} md:w-1/2 sm:w-full`}
      >
        {/* <div className="border flex flex-col justify-start lg:w-1/2 md:w-1/2 sm:w-full"> */}
        {children}
      </div>

      {/* Right spacer to center content if needed */}
      <div className="w-1/4 hidden lg:block">
        <SuggestedFollows />
      </div>
    </div>
  );
};
