import { IndividualEvent } from "@/types/event";
import { SupportedVenues } from "../_constants/supportedVenues";
import { WintonRacewayApiResponse } from "@/types/wintonRacewayTypes";

export async function getWintonRacewayEvents(startDate: Date, endDate: Date): Promise<IndividualEvent[] | undefined> {
  const events: IndividualEvent[] = [];

  try {
    const response = await fetch(SupportedVenues.WINTON_RACEWAY.url);
    const json: WintonRacewayApiResponse = await response.json();
    const widgets = json.data.widgets;

    for (const widget of Object.values(widgets)) {
      for (const event of widget.data.settings.events) {
        const newEvent: IndividualEvent = {
          id: event.id,
          title: event.name,
          start: new Date(event.start.date + ":" + event.start.time),
          end: new Date(event.end.date + ":" + event.end.time),
          venue: "WINTON_RACEWAY",
          color: SupportedVenues.WINTON_RACEWAY.color
        }

        // the API returns all events across all months, only include the ones
        // in the specified date range
        if (newEvent.start < startDate || newEvent.end > endDate) {
          continue;
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