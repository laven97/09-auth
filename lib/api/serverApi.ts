import { Note, NoteTags } from "@/types/note";
import { api } from "@/app/api/api";
import { User } from "@/types/user";
import { nextService } from "./api";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";

import { Answer } from "./clientApi";


async function buildCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieParts: string[] = [];
  if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
  if (refreshToken) cookieParts.push(`refreshToken=${refreshToken}`);

  return cookieParts.join("; ");
}

export const checkSession = async (): Promise<AxiosResponse<User | null>> => {
  const cookieHeader = await buildCookieHeader();
  return nextService.get<User | null>("/auth/session", {
    headers: { Cookie: cookieHeader },
    withCredentials: true,
  });
};

export async function getMe(): Promise<User> {
  const cookieHeader = await buildCookieHeader();
  const res = await nextService.get<User>("/users/me", {
    headers: { Cookie: cookieHeader },
    withCredentials: true,
  });
  return res.data;
}

export async function fetchNotes(
  tag: NoteTags,
  search: string,
  page: number
): Promise<Answer> {
  const params: Record<string, any> = { search, page, perPage: 12 };
  if (tag && tag !== "all") params.tag = tag;
  if (search) params.search = search;

  const cookieHeader = await buildCookieHeader();
  const res = await api.get<Answer>("/notes", {
    params,
    headers: {
      Cookie: cookieHeader,
    },
  });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await buildCookieHeader();
  const res: AxiosResponse<Note> = await nextService.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return res.data;
}
