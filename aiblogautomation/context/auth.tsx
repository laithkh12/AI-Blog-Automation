"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FormEvent,
  Dispatch,
  SetStateAction,
} from "react";
import {
  loginOrRegisterAction,
  authCheckAction,
  logoutAction,
} from "@/actions/auth";
import toast, { Toaster } from "react-hot-toast";
import { UserType, AuthResponseType } from "@/utils/types";

// Define the context type
type AuthContextType = {
  user: UserType;
  setUser: Dispatch<SetStateAction<UserType>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loginModalOpen: boolean;
  setLoginModalOpen: Dispatch<SetStateAction<boolean>>;
  handleLoginSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  loggedIn: boolean;
  logout: () => Promise<void>;
};

// Create the context with the correct type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

const initialState: UserType = {
  name: "",
  username: "",
  role: "",
  email: "",
  password: "",
  about: "",
};

// Define the props for the provider component
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // Check if the user is already logged in
  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await authCheckAction();

      if (res.user) {
        setUser(res.user);
      }
      setLoggedIn(res.loggedIn); // loggedIn is of type boolean
    } catch (err) {
      console.log("auth check error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const res: AuthResponseType = await loginOrRegisterAction(
        user.email || "",
        user.password || ""
      );
      console.log("login response: ", res);
      setUser(res.user as UserType);
      setLoggedIn(res.loggedIn as boolean);

      if (res?.error) {
        toast.error(res.error);
        setLoading(false);
      } else {
        toast.success("Login successful");
        setLoginModalOpen(false);
      }
    } catch (err) {
      console.log("login error", err);
      toast.error("Login failed. Please try again.");
      setLoginModalOpen(false);
      setUser(initialState);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutAction();
      setUser(initialState);
      setLoggedIn(false);
      toast.success("Logout successful");
    } catch (err) {
      console.log("logout error", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        loginModalOpen,
        setLoginModalOpen,
        handleLoginSubmit,
        loggedIn,
        logout,
      }}
    >
      {children}
      <Toaster />
    </AuthContext.Provider>
  );
};
