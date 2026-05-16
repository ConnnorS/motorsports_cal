import { SupportedVenues } from "@/app/_constants/supportedVenues"

export type IndividualEvent = {
  /* id is prefixed with the venue key to avoid conflicts in the Mantine Table when events from different venues have the same ID */
  id: string,
  /* rawId is the original event ID specific to the venue, without any prefix */
  rawId: string | number,
  title: string,
  start: Date,
  end: Date,
  venue: keyof typeof SupportedVenues,
  color: string
};

export type IndividualEventDetails = {
  /* id is prefixed with the venue key to avoid conflicts in the Mantine Table when events from different venues have the same ID */
  id: string;
  /* rawId is the original event ID specific to the venue, without any prefix */
  rawId: string | number;
  name: string;
  category: string | undefined;
  start: Date;
  end: Date;
  image: { url: string; height: number; width: number; } | undefined;
  description: string;
}