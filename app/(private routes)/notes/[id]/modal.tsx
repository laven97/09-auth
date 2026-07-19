"use client";
import NotePreview from "@/app/@modal/(.)notes/[id]/NotePreview.client";


export default function NoteModal({ params }: { params: { id: string } }) {
  return <NotePreview id={params.id} />;
}