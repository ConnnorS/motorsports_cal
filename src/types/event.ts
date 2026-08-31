import { SupportedVenues } from "@/app/_constants/supportedVenues"

/**
 * IndividualEvent is the main event type that this application will use.
 * All API responses from the respective venues will be parsed into this
 * type so we have a common format for all events. This type is also compatible
 * with the Mantine Calendar component which we use on the Calendar page
 */
export type IndividualEvent = {
  /* id is prefixed with the venue key to avoid conflicts in the Mantine Calendar when events from different venues have the same ID */
  id: string,
  /* rawId is the original event ID specific to the venue, without any prefix */
  rawId: string | number,
  title: string,
  start: Date,
  end: Date,
  venue: keyof typeof SupportedVenues,
  color: string
};

/**
 * IndividualEventDetails is a common format for details regarding a specific event.
 * To get the details of an event, a separate API request is usually needed to pull
 * data like the description, image, category, etc.
 */
export type IndividualEventDetails = {
  /* id is prefixed with the venue key to avoid conflicts in the Mantine Calendar when events from different venues have the same ID */
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