import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../lib/authStore";

export const LoginForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isError = useAuthStore((state) => state.isError);
  const errorMessage = useAuthStore((state) => state.errorMessage);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user && isAuthenticated) {
      navigate("/");
    }
  }, [user, isAuthenticated, navigate, isError, errorMessage]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = async (e: any) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-5">
      <h2 className="text-2xl font-sans font-semibold">
        Log in to make the best of Bird App
      </h2>
      <div className="flex flex-col items-center">
        <form onSubmit={handleLogin} className="flex flex-col space-y-3">
          <label htmlFor="username">Username</label>

          <input
            className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
            type="text"
            name="username"
            placeholder="hulk.hogan"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="p-3 rounded-md bg-emerald-600 text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Log In"}
          </button>
          {isError && (
            <p className="text-red-500 text-sm">{`Error: ${errorMessage}`}</p>
          )}
          <p className="text-sm">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
