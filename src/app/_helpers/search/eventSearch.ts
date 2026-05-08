import { getCmsEventDetails, getCmsEvents } from "@/app/_api/cms";
import { getWintonRacewayEventDetails, getWintonRacewayEvents } from "@/app/_api/wintonRaceway";
import { SupportedVenues } from "@/app/_constants/supportedVenues";
import { IndividualEvent, IndividualEventDetails } from "@/types/event";

export async function eventSearch(
  startDate: Date,
  endDate: Date,
  venues: (keyof typeof SupportedVenues)[],
  title: string | null,
  sortByDate: boolean
): Promise<IndividualEvent[]> {

  // convert our start date to 12:01am and end date to 11:59pm
  const startOfStartDate = new Date(startDate);
  startOfStartDate.setHours(0, 1, 0, 0);
  const endOfEndDate = new Date(endDate);
  endOfEndDate.setHours(23, 59, 0, 0);

  let results: IndividualEvent[] = [];

  /* go through every venue we want to search and search for events */
  for (const venue of venues) {
    let searchResults: IndividualEvent[] | undefined;
    /* handle search for all CMS venues */
    if (SupportedVenues[venue].cmsSupported) {
      searchResults = await getCmsEvents(startOfStartDate, endOfEndDate, venue);
    }
    /* handle search for all other venues */
    else {
      if (venue === "WINTON_RACEWAY") {
        searchResults = await getWintonRacewayEvents(startOfStartDate, endOfEndDate);
      }
    }

    if (searchResults) {
      results = results.concat(searchResults);
    }
  }

  /* remove any events with invalid date ranges */
  results = results.filter(event => {
    if (event.end < event.start) {
      console.log(`Event ${event.title} has end date (${event.end}) before start date (${event.start}), removing event`);
      return false;
    }
    return event;
  });

  /* now filter our search results by the title */
  if (title) {
    results = results.filter(event =>
      event.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())
    );
  }

  /* now sort our events */
  if (sortByDate) {
    results = results.sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  return results;
}

export async function getEventDetails(
  eventId: string | number,
  venue: keyof typeof SupportedVenues
): Promise<IndividualEventDetails | undefined> {
  let eventDetails: IndividualEventDetails | undefined;

  if (SupportedVenues[venue].cmsSupported) {
    eventDetails = await getCmsEventDetails(eventId, venue);
  }
  else {
    if (venue === "WINTON_RACEWAY") {
      eventDetails = await getWintonRacewayEventDetails(eventId);
    }
  }

  return eventDetails;
}