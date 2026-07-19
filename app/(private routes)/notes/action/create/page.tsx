import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create own note",
  description: "User is able to create his own note",
  openGraph: {
    title: "Create own note",
    description: "User is able to create his own note",
    url: "http://localhost:3000/notes/action/create",
    images: [
      {
        url: "https://08-zustand-nine-omega.vercel.app/og-create-note.png",
        width: 1200,
        height: 630,
        alt: "Create Note",
      },
    ],
  },
};
export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        {<NoteForm />}
      </div>
    </main>
  );
}
