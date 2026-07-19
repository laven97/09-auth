import Link from "next/link";
import Image from "next/image";

import css from "./ProfilePage.module.css";
import { getMe } from "@/lib/api/serviceApi";

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
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>
          <div className={css.profileInfo}>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>
      </main>
    </>
  );
}
