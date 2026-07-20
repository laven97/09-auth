import { Metadata } from "next";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { NotesClient } from "./Notes.client";
import { NoteTags } from "@/types/note";
import { fetchNotes } from "@/lib/api/serverApi";

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";

  const title =
    tag === "all"
      ? "Browse all notes without filtering."
      : `Browse notes filtered by tag: ${tag}.`;

  const description =
    tag === "all"
      ? "Browse all notes without filtering."
      : `Browse notes filtered by tag: ${tag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url:
        tag === "all"
          ? "http://localhost:3000/notes/filter/all"
          : `http://localhost:3000/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
  };
}

export default async function NotesPage({ params }: NotesProps) {
  const { slug } = await params;
  const tag = (slug && slug.length > 0 ? slug[0] : "all") as NoteTags;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, "", 1],
    queryFn: () => fetchNotes(tag === "all" ? "all" : tag, "", 1),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
