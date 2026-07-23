"use client";

import css from "./NotesPage.module.css";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import { NoteList } from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { NoteTags } from "@/types/note";
import Link from "next/link";
import { fetchNotes } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface NotesClientProps {
  tag: NoteTags;
}

export function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", tag, search, page],
    queryFn: () => fetchNotes(tag, search, page),
    enabled: isAuthenticated,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header>
        <SearchBox
          value={searchInput}
          onSearch={(value) => {
            setSearchInput(value);
            debouncedSearch(value);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={totalPages}
            onPageChange={({ selected }) => setPage(selected + 1)}
          />
        )}

        <Link className={css.button} href="/notes/action/create">
          <button>Create note +</button>
        </Link>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}

      {isLoading && <p>Loading...</p>}

      {isError && <p>Error...</p>}
    </div>
  );
}
