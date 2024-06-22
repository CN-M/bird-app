import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/authStore";

export const AuthButton = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const isError = useAuthStore((state) => state.isError);
  const errorMessage = useAuthStore((state) => state.errorMessage);

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-emerald-500 rounded-lg px-5 py-2">
      {user && isAuthenticated ? (
        <button className="" onClick={handleLogout} disabled={isLoading}>
          {isLoading ? "Logging Out..." : "Logout"}
        </button>
      ) : (
        <button className="" onClick={() => navigate("/login")}>
          Login
        </button>
      )}
      {isError && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
};
