"use client";

import { useEffect } from "react";

import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
  hasInitialToken?: boolean;
};

const AuthProvider = ({ children, hasInitialToken }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          const user = await getMe();
          if (user) {
            setUser(user);
          } else {
            clearIsAuthenticated();
          }
        }
      } catch (err) {
        clearIsAuthenticated();
      }
    };

    fetchUser();
  }, [hasInitialToken, setUser, clearIsAuthenticated]);

  return children;
};

export default AuthProvider;
