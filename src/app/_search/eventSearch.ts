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

  let results: IndividualEvent[] = [];

  /* go through every venue we want to search and search for events */
  for (const venue of venues) {
    let searchResults: IndividualEvent[] | undefined;
    /* handle search for all CMS venues */
    if (SupportedVenues[venue].cmsSupported) {
      searchResults = await getCmsEvents(startDate, endDate, venue);
    }
    /* handle search for all other venues */
    else {
      if (venue === "WINTON_RACEWAY") {
        searchResults = await getWintonRacewayEvents(startDate, endDate);
      }
    }

    if (searchResults) {
      results = results.concat(searchResults);
    }
  }

  /* prefix each event id with the venue name to avoid instances where
  two events from different venues may have the same ID number */
  const usedEventIds: Record<string, number> = {};
  for (const result of results) {
    // sometimes there's multiple events with the same ID in the same venue
    // but at different times, we'll handle that too
    let newResultId: string = `${result.venue}_${result.id}`;
    if (newResultId in usedEventIds) {
      usedEventIds[newResultId] += 1;
      newResultId += `_${usedEventIds[newResultId]}`;
    }
    else {
      usedEventIds[newResultId] = 0;
    }

    result.id = newResultId;
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

/**
 * Retrieves more in depth details for a specific event
 * @param rawId - the raw ID of the event, specific to the venue
 * @param venue - the venue of the event, so we know which API to call
 * @returns the details of the event or undefined if not found
 */
export async function getEventDetails(
  rawId: string | number,
  venue: keyof typeof SupportedVenues
): Promise<IndividualEventDetails | undefined> {
  let eventDetails: IndividualEventDetails | undefined;

  if (SupportedVenues[venue].cmsSupported) {
    eventDetails = await getCmsEventDetails(rawId, venue);
  }
  else {
    if (venue === "WINTON_RACEWAY") {
      eventDetails = await getWintonRacewayEventDetails(rawId);
    }
  }

  return eventDetails;
}