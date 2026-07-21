import { IndividualEvent } from "@/types/event";
import { SelectedVenues } from "@/types/selectedVenues";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CalendarPageStore {
  searchResults: IndividualEvent[],
  setSearchResults: (value: IndividualEvent[]) => void,
  selectedVenues: SelectedVenues,
  setSelectedVenues: (value: SelectedVenues) => void,
  calendarDate: Date,
  setCalendarDate: (value: Date) => void,
  searchValues: string[],
  addSearchValue: (value: string) => void,
  deleteSearchValue: (index: number) => void
}

export const calendarPageStore = create<CalendarPageStore>()(
  persist(
    set => ({
      searchResults: [],
      setSearchResults: (newSearchResults) => set(state => ({ ...state, searchResults: newSearchResults })),

      selectedVenues: { "LAKESIDE_PARK": false, "QLD_RACE_WAY": false, "MORGAN_PARK": false, "WINTON_RACEWAY": false },
      setSelectedVenues: (newValue) => set(state => ({ ...state, selectedVenues: newValue })),

      calendarDate: new Date(),
      setCalendarDate: (newDate) => set(state => ({ ...state, calendarDate: newDate })),

      searchValues: [],
      addSearchValue: (newValue) => set(state => ({ ...state, searchValues: [...state.searchValues, newValue] })),
      deleteSearchValue: (index) => set(state => ({ ...state, searchValues: state.searchValues.filter((_, i) => i !== index) }))
    }),
    {
      name: "calendarPageStore",
      onRehydrateStorage: () => (state) => {
        // Dates are stored as `string` in localstorage so we must
        // make sure to convert them back before rehydrating
        state?.setCalendarDate(new Date(state.calendarDate));
        state?.searchResults.map(result => {
          result.start = new Date(result.start);
          result.end = new Date(result.end);
        });
      }
    }
  )
);