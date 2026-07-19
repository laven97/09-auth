import { AxiosResponse } from "axios";

import { api } from "@/app/api/api";
import { Note, NoteTags } from "@/types/note";
import { User } from "@/types/user";
import { nextService } from "./api";

export interface Answer {
  notes: Note[];
  totalPages: number;
}

export async function register(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await nextService.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await nextService.post<User>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await nextService.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const { data } = await nextService.get<User | null>("/auth/session");
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await nextService.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: { username: string }): Promise<User> {
  const { data } = await nextService.patch<User>("/users/me", payload);
  return data;
}

export async function fetchNotes(
  tag: NoteTags,
  search: string,
  page: number
): Promise<Answer> {
  const params: Record<string, any> = { search, page, perPage: 12 };
  if (tag && tag !== "all") params.tag = tag;
  if (search) params.search = search;

  const res = await api.get<Answer>("/notes", { params });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return res.data;
}

export async function createNote(
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  const res: AxiosResponse<Note> = await api.post("/notes", note);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return res.data;
}
