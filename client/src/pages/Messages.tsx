import { MainLayout } from "../components/MainLayout";
import { useAuthStore } from "../lib/authStore";

export const Messages = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <MainLayout>
      {user ? (
        <p className="w-full">Read Messages</p>
      ) : (
        <p>Login to start having conversations</p>
      )}
    </MainLayout>
  );
};
