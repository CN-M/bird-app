import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/authStore";

export const SignUpForm = () => {
  const navigate = useNavigate();

  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
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
    register({ email, firstName, lastName, password });
  };

  return (
    <div className="flex flex-col p-10 items-center space-y-5">
      <h2 className="text-2xl font-sans font-semibold">
        Don't have an account?
      </h2>
      <h2 className="text-2xl font-sans font-semibold">
        Sign up to make the best of Task Taker
      </h2>
      <div className="flex flex-col items-center">
        <form onSubmit={handleRegister} className="flex flex-col space-y-3">
          <div className="flex gap-2 justify-between">
            <input
              className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
              type="text"
              placeholder="Jack"
              value={firstName}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <input
              className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
              type="text"
              placeholder="Sparrow"
              value={lastName}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
          <input
            className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
            type="email"
            placeholder="hulk@hogan.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
            type="password"
            placeholder="password"
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
