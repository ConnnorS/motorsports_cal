import { IndividualEvent, IndividualEventDetails } from "@/types/event";
import { SupportedVenues } from "../_constants/supportedVenues";
import { WintonRacewayApiResponse } from "@/types/wintonRacewayTypes";

/**
 * Strips the time out of a date so that we can compare
 * events based on the date alone, not worrying about time
 * @param date 
 * @returns date with no time
 */
function toDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function getWintonRacewayEvents(startDate: Date, endDate: Date): Promise<IndividualEvent[] | undefined> {
  const events: IndividualEvent[] = [];

  try {
    const response = await fetch(SupportedVenues.WINTON_RACEWAY.url);
    const json: WintonRacewayApiResponse = await response.json();
    const widgets = json.data.widgets;

    for (const widget of Object.values(widgets)) {
      for (const event of widget.data.settings.events) {
        // the API returns all events across all months, only include the ones
        // in the specified date range
        if (
          toDay(new Date(event.start.date)) < toDay(startDate) ||
          toDay(new Date(event.end.date)) > toDay(endDate)
        ) {
          continue;
        }

        const newEvent: IndividualEvent = {
          id: event.id.toString(),
          rawId: event.id,
          title: event.name,
          start: new Date(event.start.date + ":" + event.start.time),
          end: new Date(event.end.date + ":" + event.end.time),
          venue: "WINTON_RACEWAY",
          color: SupportedVenues.WINTON_RACEWAY.color
        }

        events.push(newEvent);
      }
    }

    return events;
  }
  catch (error: unknown) {
    console.error(error);
    return undefined;
  }
}

export async function getWintonRacewayEventDetails(eventId: string | number): Promise<IndividualEventDetails | undefined> {
  try {
    /* Winton Raceway is tricky. The API returns a list of every single event
      they have in existence with all the information. So for now, we'll just call
      the API again, find that event, and extract the data
    */
    const response = await fetch(SupportedVenues.WINTON_RACEWAY.url);
    const json: WintonRacewayApiResponse = await response.json();
    const widgets = json.data.widgets;

    for (const widget of Object.values(widgets)) {
      for (const event of widget.data.settings.events) {
        if (event.id === eventId.toString()) {
          const newEventDetails: IndividualEventDetails = {
            id: event.id.toString(),
            rawId: event.id,
            name: event.name,
            category: undefined,
            start: new Date(event.start.date + ":" + event.start.time),
            end: new Date(event.end.date + ":" + event.end.time),
            image: { url: event.image.url, height: event.image.height, width: event.image.width },
            description: event.description
          };

          return newEventDetails;
        }
      }
    }
  }
  catch (error: unknown) {
    console.error(error);
    return undefined;
  }
}