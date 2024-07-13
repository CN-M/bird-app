import { useNavigate } from "react-router-dom";
import { AuthButton } from "./auth/AuthButton";
import { LoginAsGuestButton } from "./auth/LoginAsGuestBtn";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 p-4 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate("/")}
              className="text-white text-2xl font-bold"
            >
              Bird App
            </button>
          </div>
          <div className="flex space-x-4 items-center">
            <AuthButton />
            <LoginAsGuestButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
