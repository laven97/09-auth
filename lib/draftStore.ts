import { create } from "zustand";
import type { NoteFormValues } from "@/types/note";

interface DraftState {
  draft: NoteFormValues;
  setDraft: (draft: NoteFormValues) => void;
  clearDraft: () => void;
}

export const useDraftStore = create<DraftState>((set) => ({
  draft: {
    title: "",
    content: "",
    tag: "Todo",
  },
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: { title: "", content: "", tag: "Todo" } }),
}));
