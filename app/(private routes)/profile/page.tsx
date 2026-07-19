"use client";

import Link from "next/link";
import Image from "next/image";

import css from "./ProfilePage.module.css";
import { getMe } from "@/lib/api/clientApi";

export default async function ProfilePage() {
  let user;
  try {
    user = await getMe();
  } catch (error) {
    return (
      <main className={css.mainContent}>
        <p className={css.error}>Unauthorized. Please sign in again.</p>
        <Link href="/sign-in">Go to Sign In</Link>
      </main>
    );
  }

  return (
    <>
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
            <Link href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </Link>
          </div>
          <div className={css.avatarWrapper}>
            <Image
              src="user_avatar"
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>
          <div className={css.profileInfo}>
            <p>Username: user_username</p>
            <p>Email: user_email</p>
          </div>
        </div>
      </main>
    </>
  );
}
