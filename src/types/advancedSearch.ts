import { SupportedVenues } from "@/app/_constants/supportedVenues";

export type AdvancedSearchParams = {
  start: Date;
  end: Date;
  title: string;
  venues: (keyof typeof SupportedVenues)[];
};