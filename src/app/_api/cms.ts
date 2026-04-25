import { IndividualEvent, IndividualEventDetails } from "@/types/event";
import { SupportedVenues } from "../_constants/supportedVenues";
import { QldRacewayEvent, QldRacewayEventDetails } from "@/types/qldRacewayTypes";
import { MorganParkEvent, MorganParkEventDetails } from "@/types/morganParkTypes";
import { LakesideParkEvent, LakesideParkEventDetails } from "@/types/lakesideParkTypes";
import { WintonRacewayWidgetDetails } from "@/types/wintonRacewayTypes";

/**
 * Gets the list of events within a given date range for a given venue which uses the cms
 * calendar management system. So far, Queensland Raceway, Lakeside Park, and Morgan Park all
 * use the "cms" API for their respective venues. So instead of having a separate function for each
 * venue, we'll put them all into one.
 * @param startDate 
 * @param endDate 
 * @param venue 
 */
export async function getCmsEvents(startDate: Date, endDate: Date, venue: keyof typeof SupportedVenues): Promise<IndividualEvent[] | undefined> {
  const events: IndividualEvent[] = [];

  try {
    // return undefined for any venues that don't use the CMS system
    if (!["QLD_RACE_WAY", "LAKESIDE_PARK", "MORGAN_PARK"].includes(venue)) {
      throw new Error("Cms is not supported for venue: " + venue);
    }

    const calendarUrl: string = SupportedVenues[venue].url + "/calendar";
    const requestUrl: string = `${calendarUrl}?start=${startDate.toISOString()}&end=${endDate.toISOString()}`;
    const response = await fetch(requestUrl);
    const json: QldRacewayEvent[] | MorganParkEvent[] | LakesideParkEvent[] = await response.json();

    for (const event of json) {
      const newEvent: IndividualEvent = {
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        venue,
        color: SupportedVenues[venue].color
      };
      events.push(newEvent);
    }

    return events;

  }
  catch (error: unknown) {
    console.error(error);
    return undefined;
  }
}

/**
 * Like the above getCmsEvents() function, gets an individual event's details based on the event ID for a given
 * raceway which uses the CMS system. So far, these raceways are Queensland Raceway, Lakeside Park, and Winton Park
 * @param eventId 
 * @param venue 
 */
export async function getCmsEventDetails(eventId: number | string, venue: keyof typeof SupportedVenues): Promise<IndividualEventDetails | undefined> {
  try {
    // return undefined for any venues that don't use the CMS system
    if (!["QLD_RACE_WAY", "LAKESIDE_PARK", "MORGAN_PARK"].includes(venue)) {
      throw new Error("Cms is not supported for venue: " + venue);
    }

    const response = await fetch(`${SupportedVenues[venue].url}/${eventId}`)
    let details: IndividualEventDetails | undefined = undefined;

    if (venue === "QLD_RACE_WAY") {
      const responseJson: QldRacewayEventDetails = await response.json();
      details = {
        id: responseJson.id,
        title: responseJson.title,
        name: responseJson.name,
        venue: { ...responseJson.venue, code: "QLD_RACE_WAY" },
        category: responseJson.category.name,
        start: new Date(responseJson.start_time),
        end: new Date(responseJson.end_time),
        image: {
          url: responseJson.image.url,
          height: responseJson.image.height,
          width: responseJson.image.width
        },
        description: responseJson.calendar_content
      };
    }
    else if (venue === "LAKESIDE_PARK") {
      const responseJson: LakesideParkEventDetails = await response.json();
      details = {
        id: responseJson.id,
        name: responseJson.name,
        start: new Date(responseJson.start_time),
        end: new Date(responseJson.end_time),
        description: responseJson.description
      };
    }
    else if (venue === "MORGAN_PARK") {
      const responseJson: MorganParkEventDetails = await response.json();
      details = {
        id: responseJson.id,
        name: responseJson.name,
        start: new Date(responseJson.start_date),
        end: new Date(responseJson.end_date),
        description: responseJson.calendar_content,
        image: {
          url: responseJson.type.photo.url,
          height: responseJson.type.photo.height,
          width: responseJson.type.photo.width
        }
      };
    }

    return details;
  }
  catch (error: unknown) {
    console.error(error);
    return undefined;
  }

}