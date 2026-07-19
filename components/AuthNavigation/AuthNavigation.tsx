"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";


import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      router.push("/sign-in");
    } catch (error) {
      console.error("logout failed", error);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={`${css.navigationLink} ${
                pathname === "/profile" ? css.active : ""
              }`}
            >
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>
              {user?.username ? user.username : user?.email}
            </p>
            <button onClick={handleLogout} className={css.logoutButton}>
              LogOut
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={`${css.navigationLink} ${
                pathname === "/sign-in" ? css.active : ""
              }`}
            >
              LogIn
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={`${css.navigationLink} ${
                pathname === "/sign-up" ? css.active : ""
              }`}
            >
              Sign Up
            </Link>
          </li>
        </>
      )}
    </>
  );
}
