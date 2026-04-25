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
  id: number;
  title?: { id: number; name: string; };
  name: string;
  venue?: { code: keyof typeof SupportedVenues; id: number; name: string; colour: string };
  category?: string;
  start: Date;
  end: Date;
  image?: { url: string; height: number; width: number; };
  description: string;
}