"use client";
import { useRouter } from "next/navigation";
import NotePreview from "../NotePreview.client";

export default function NoteModal({ params }: { params: { id: string } }) {
  return <NotePreview id={params.id} />;
}