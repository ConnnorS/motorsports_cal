import { IndividualEvent } from "@/types/event";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedEventsStore {
  savedEvents: IndividualEvent["id"][],
  addSavedEvent: (id: IndividualEvent["id"]) => void
}

export const UseSavedEventsStore = create<SavedEventsStore>()(
  persist(
    set => ({
      savedEvents: [],
      addSavedEvent: id => set(state => ({ ...state, savedEvents: [...state.savedEvents, id] }))
    }),
    {
      name: "savedEventsStore"
    }
  )
);