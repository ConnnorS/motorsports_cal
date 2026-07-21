import { SupportedVenues } from "@/app/_constants/supportedVenues";

export type AdvancedSearchParams = {
  start: Date;
  end: Date;
  title: string[];
  resultsPerPage: number;
  venues: (keyof typeof SupportedVenues)[];
};