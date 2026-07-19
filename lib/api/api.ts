import axios, { AxiosError } from "axios";

export const nextService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api",
  withCredentials: true,
});

export type ApiError = AxiosError<{ error: string }>;