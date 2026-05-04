"use client";

import React, { useState } from "react";
import "./searchPage.scss";
import { AdvancedSearchParams } from "@/types/advancedSearch";
import AdvancedSearch from "../_components/search/AdvancedSearch/AdvancedSearch";
import { IndividualEvent } from "@/types/event";
import { getCmsEvents } from "../_api/cms";
import { SupportedVenues } from "../_constants/supportedVenues";
import { getWintonRacewayEvents } from "../_api/wintonRaceway";
import SearchResultCard from "../_components/search/SearchResultCard/SearchResultCard";

export default function SearchPage(): React.JSX.Element {
  const [searchParams, setSearchParams] = useState<AdvancedSearchParams>({
    start: new Date(),
    end: new Date(),
    title: "",
    venues: []
  });
  const [searchResults, setSearchResults] = useState<IndividualEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAdvancedSearch = async () => {
    try {
      setIsLoading(true);
      let allEvents: IndividualEvent[] = [];

      /* first, search for all our events */
      for (const venue of searchParams.venues) {
        // search all venues using the CMS system
        if (SupportedVenues[venue].cmsSupported) {
          const events = await getCmsEvents(
            searchParams.start,
            searchParams.end,
            venue
          );

          if (events) {
            allEvents = allEvents.concat(events);
          }
          else {
            alert(`Error searching for ${venue}'s events`);
          }
        }
        // handle all other venues below...
        if (venue === "WINTON_RACEWAY") {
          const events = await getWintonRacewayEvents(
            searchParams.start,
            searchParams.end,
          );

          if (events) {
            allEvents = allEvents.concat(events);
          }
          else {
            alert(`Error searching for ${venue}'s events`);
          }
        }
      }

      /* second, filter our events by title */
      if (searchParams.title) {
        allEvents = allEvents.filter(event =>
          event.title.toLowerCase().includes(searchParams.title.toLowerCase())
        );
      }

      /* third, sort our events by date */
      // @ts-ignore
      allEvents.sort((a, b) => a.start - b.start);

      /* finally, set our search results state variable */
      setSearchResults(allEvents);
    }
    catch (error: unknown) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="searchPage">
      <AdvancedSearch
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        handleEventSearch={handleAdvancedSearch}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <div className="searchResults">
        {searchResults.map((result, index) => <SearchResultCard key={index} value={result} />)}
      </div>
    </div>
  );
}