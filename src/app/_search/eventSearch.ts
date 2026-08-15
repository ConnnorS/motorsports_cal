import { getCmsEventDetails, getCmsEvents } from "@/app/_api/cms";
import { getWintonRacewayEventDetails, getWintonRacewayEvents } from "@/app/_api/wintonRaceway";
import { SupportedVenues } from "@/app/_constants/supportedVenues";
import { IndividualEvent, IndividualEventDetails } from "@/types/event";

/**
 * Performs a search for all events from the specified
 * venues between the specified startDate and endDate
 * then filters by any other search params, like the title.
 * @param startDate 
 * @param endDate 
 * @param venues 
 * @param title 
 * @param sortByDate 
 * @returns array of Events (empty if nothing found) or Error
 */
export async function eventSearch(
  startDate: Date,
  endDate: Date,
  venues: (keyof typeof SupportedVenues)[],
  title: string[],
  sortByDate: boolean
): Promise<IndividualEvent[] | Error> {

  let results: IndividualEvent[] = [];

  /* go through every venue we want to search and search for events */
  for (const venue of venues) {
    let result: IndividualEvent[] | Error | undefined = undefined;
    /* handle search for all CMS venues */
    if (SupportedVenues[venue].cmsSupported) {
      result = await getCmsEvents(startDate, endDate, venue);
    }
    /* handle search for all other venues */
    else {
      if (venue === "WINTON_RACEWAY") {
        result = await getWintonRacewayEvents(startDate, endDate);
      }
    }
    /* check our result */
    if (!result) {
      return new Error(`result is undefined`);
    }
    else if (result instanceof Error) {
      return new Error(`Error while searching for events: ${result.message}`);
    }
    else {
      results = results.concat(result);
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
  if (title.length > 0) {
    results = results.filter(event =>
      title.some(searchTerm =>
        event.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      )
    );
  }

  /* now sort our events */
  if (sortByDate) {
    results = results.sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  return results;
}

/**
 * Gets the details for a specified event's rawId
 * (rawId is the Event ID specific to the venue)
 * @param rawId 
 * @param venue 
 * @returns the IndividualEventDetails or an Error
 */
export async function getEventDetails(
  rawId: string | number,
  venue: keyof typeof SupportedVenues
): Promise<IndividualEventDetails | Error> {
  let eventDetails: IndividualEventDetails | Error;

  if (SupportedVenues[venue].cmsSupported) {
    eventDetails = await getCmsEventDetails(rawId, venue);
  }
  else if (venue === "WINTON_RACEWAY") {
    eventDetails = await getWintonRacewayEventDetails(rawId);
  }
  else {
    return new Error(`Unsupported venue ${venue}`);
  }

  if (eventDetails instanceof Error) {
    return new Error(`Error retrieving event details for Event ID ${rawId} from ${venue}`);
  }

  eventDetails.id = `${venue}_${eventDetails.id}`;

  return eventDetails;
}