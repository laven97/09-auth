import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";


import NotePreview from "./NotePreview.client";
import { fetchNoteById } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotePreviewPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
