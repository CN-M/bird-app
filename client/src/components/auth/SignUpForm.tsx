import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../lib/authStore";

export const SignUpForm = () => {
  const navigate = useNavigate();

  const [profileName, setProfileName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isError = useAuthStore((state) => state.isError);
  const errorMessage = useAuthStore((state) => state.errorMessage);

  const register = useAuthStore((state) => state.register);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user && isAuthenticated) {
      navigate("/");
    }
  }, [user, isAuthenticated, navigate, isError, errorMessage]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRegister = async (e: any) => {
    e.preventDefault();
    register({ username, profileName, email, password });
  };

  return (
    <div className="flex flex-col p-10 items-center space-y-5">
      <h2 className="text-2xl font-sans font-semibold">
        Don't have an account?
      </h2>
      <h2 className="text-2xl font-sans font-semibold">
        Sign up to make the best of Bird App
      </h2>
      <div className="flex flex-col items-center">
        <form onSubmit={handleRegister} className="flex flex-col space-y-3">
          <div className="flex items-center space-x-5">
            <div className="flex flex-col space-y-3">
              <label htmlFor="profileName">Display Name</label>
              <input
                className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
                type="text"
                name="profileName"
                placeholder="Hulk Hogan"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-3">
              <label htmlFor="username">Username</label>
              <input
                className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
                type="text"
                name="username"
                placeholder="hulk.hogan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <label htmlFor="email">Email Address</label>
          <input
            className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
            type="email"
            name="email"
            placeholder="hulk@hogan.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
            type="password"
            name="password"
            placeholder="Br0th3r!"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="p-3 rounded-md bg-emerald-600 text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          {isError && (
            <p className="text-red-500 text-sm">{`Error: ${errorMessage}`}</p>
          )}
          <p className="text-sm">
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
