import { AdvancedSearchParams } from "@/types/advancedSearch";
import { IndividualEvent } from "@/types/event";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SearchPageStore {
  searchParams: AdvancedSearchParams,
  setSearchParams: (value: AdvancedSearchParams) => void,
  searchResults: IndividualEvent[],
  setSearchResults: (value: IndividualEvent[]) => void,
  pageNumber: number,
  setPageNumber: (value: number) => void
}

export const UseSearchPageStore = create<SearchPageStore>()(
  persist(
    set => ({
      searchParams: {
        start: new Date(),
        end: new Date(),
        resultsPerPage: 12,
        pageNumber: 1,
        title: [],
        venues: []
      },
      setSearchParams: value => set(state => ({ ...state, searchParams: value })),
      searchResults: [],
      setSearchResults: value => set(state => ({ ...state, searchResults: value })),
      pageNumber: 1,
      setPageNumber: value => set(state => ({ ...state, pageNumber: value }))
    }),
    {
      name: "searchPageStore",
      storage: createJSONStorage(() => localStorage, {
        // Dates are stored as `string` in localstorage so we must
        // make sure to convert them back before rehydrating
        reviver: (key, value) => {
          if (key === "start" || key === "end") return new Date(value as string);
          return value;
        }
      })
    }
  )
);