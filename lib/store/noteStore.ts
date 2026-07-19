import { NoteFormValues } from "@/types/note";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const initialDraft: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteStore {
  draft: NoteFormValues;
  setDraft: (note: NoteFormValues) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set({ draft: note }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { initialDraft };
