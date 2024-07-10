import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { User } from "../types";
import { rootURL } from "./utils";

const user = JSON.parse(localStorage.getItem("user")!);

interface AuthState {
  isAuthenticated: boolean;
  isGuest: boolean;
  isError: boolean;
  isLoading: boolean;
  user: User | null;
  errorMessage: string;
  login: (userData: { username: string; password: string }) => void;
  loginAsGuest: () => void;
  logout: () => void;
  logoutGuest: () => void;
  register: (userData: {
    username: string;
    profileName: string;
    email: string;
    password: string;
  }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: user ? true : false,
  isError: false,
  isGuest: false,
  isLoading: false,
  user: user ? user : null,
  errorMessage: "",
  login: async (userData: { username: string; password: string }) => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
      const data: User = await login(userData);
      set({ isAuthenticated: true, user: data });
      toast.success("Successfully logged in!");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const { error } = err.response.data;

      set({
        isError: true,
        errorMessage:
          err.response.data.error || "An error occurred during login",
      });

      toast.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  loginAsGuest: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
      const guestData = {
        username: "batman",
        password: "SUPERMANSUCKZ",
      };

      const data: User = await login(guestData);
      set({ isAuthenticated: true, user: data, isGuest: true });
      toast.success("Successfully logged in!");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const { error } = err.response.data;

      set({
        isError: true,
        errorMessage:
          err.response.data.error || "An error occurred during login",
      });

      toast.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData: {
    username: string;
    profileName: string;
    email: string;
    password: string;
  }) => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
      const data: User = await register(userData);
      set({ isAuthenticated: true, user: data });
      toast.success("User successfully registered!");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const { error } = err.response.data;

      set({
        isError: true,
        errorMessage:
          err.response.data.error || "An error occurred during registration",
      });

      toast.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
      await logout();
      set({ isAuthenticated: false, user: null });
      toast.success("Successfully logged out!");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const { error } = err.response.data;

      set({
        isError: true,
        errorMessage: error || "An error occurred during logout",
      });

      toast.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  logoutGuest: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
      await logout();
      set({ isAuthenticated: false, user: null, isGuest: false });
      toast.success("Successfully logged out!");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const { error } = err.response.data;

      set({
        isError: true,
        errorMessage: error || "An error occurred during logout",
      });

      toast.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

const register = async (userData: {
  username: string;
  profileName: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${rootURL}/account/register`, userData, {
    withCredentials: true,
  });

  if (response.data) {
    const { data } = response;
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } else {
    throw new Error("Registration failed");
  }
};

const login = async (userData: { username: string; password: string }) => {
  const response = await axios.post(`${rootURL}/account/login`, userData, {
    withCredentials: true,
  });

  if (response.data) {
    const { data } = response;

    localStorage.setItem(
      "user",
      JSON.stringify({ ...data, timestamp: new Date().getTime() })
    );
    return data;
  } else {
    throw new Error("Login failed");
  }
};

const logout = async () => {
  const response = await axios.post(`${rootURL}/account/logout`, {
    withCredentials: true,
  });

  if (response.data) {
    const { data } = response;
    localStorage.removeItem("user");
    return data;
  } else {
    throw new Error("Logout failed");
  }
};
