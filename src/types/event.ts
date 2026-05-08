import { SupportedVenues } from "@/app/_constants/supportedVenues"

export type IndividualEvent = {
  id: number | string,
  title: string,
  start: Date,
  end: Date,
  venue: keyof typeof SupportedVenues,
  color: string
};

export type IndividualEventDetails = {
  id: number | string;
  name: string;
  category: string | undefined;
  start: Date;
  end: Date;
  image: { url: string; height: number; width: number; } | undefined;
  description: string;
}