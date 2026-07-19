"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";

interface Props {
  id: string;
}

export default function NotePreview({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false, 
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading note</p>}

      {data && (
        <div>
          <button onClick={handleClose}>Close</button>

          <h2>{data.title}</h2>
          <p>
            <b>Tag:</b> {data.tag}
          </p>
          <p>{data.content}</p>
          <p style={{ fontSize: 12, color: "#888" }}>
            Created: {data.createdAt}
          </p>
        </div>
      )}
    </Modal>
  );
}