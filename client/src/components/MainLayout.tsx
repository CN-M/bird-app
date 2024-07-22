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
    <div className="flex space-x-5 justify-center h-full w-full overflow-y-auto">
      {/* Sidebar container */}
      <div className="w-1/4 h-full hidden lg:block">
        <UserPanel />
      </div>

      {/* Main content container */}
      <div
        className={`border flex flex-col justify-start h-full overflow-y-visible lg:w-1/2 ${classNames} md:w-1/2 sm:w-full`}
      >
        {children}
      </div>

      {/* Right spacer to center content if needed */}
      <div className="w-1/4 h-full hidden lg:block">
        <SuggestedFollows />
      </div>
    </div>
  );
};
