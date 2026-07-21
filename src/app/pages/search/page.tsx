"use client";

import EventDetails from "@/app/_components/event/EventDetails";
import { AdvancedSearchParams } from "@/types/advancedSearch";
import { IndividualEvent, IndividualEventDetails } from "@/types/event";
import { Modal, Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import AdvancedSearch from "../../_components/search/AdvancedSearch/AdvancedSearch";
import SearchResultCard from "../../_components/SearchResultCard/SearchResultCard";
import { eventSearch, getEventDetails } from "../../_search/eventSearch";
import "./searchPage.scss";

export default function SearchPage(): React.JSX.Element {
  const [searchParams, setSearchParams] = useState<AdvancedSearchParams>({
    start: new Date(),
    end: new Date(),
    resultsPerPage: 12,
    title: [],
    venues: []
  });
  const [searchResults, setSearchResults] = useState<IndividualEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [opened, { open, close }] = useDisclosure(false);
  const [currentlyOpenEvent, setCurrentlyOpenEvent] = useState<IndividualEventDetails | undefined>(undefined);


  const handleAdvancedSearch = async () => {
    try {
      setIsLoading(true);
      const allEvents = await eventSearch(
        searchParams.start,
        searchParams.end,
        searchParams.venues,
        searchParams.title,
        true
      );
      setSearchResults(allEvents);
    }
    catch (error: unknown) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = async (event: IndividualEvent) => {
    open();

    const eventDetails = await getEventDetails(event.rawId, event.venue);
    setCurrentlyOpenEvent(eventDetails);
  }

  const handleEventClose = () => {
    setCurrentlyOpenEvent(undefined);
    close();
  }

  return (
    <>
      <Modal title="Event Details" opened={opened} onClose={close}>
        <EventDetails currentlyOpenEvent={currentlyOpenEvent} />
      </Modal>

      <div className="searchPage">
        <AdvancedSearch
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          handleEventSearch={handleAdvancedSearch}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <div className="searchResults">
          {searchResults
            .slice((pageNumber - 1) * searchParams.resultsPerPage, pageNumber * searchParams.resultsPerPage)
            .map((event) => (
              <SearchResultCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
        </div>

        <div className="pagination">
          <Pagination
            total={searchResults.length / Number(searchParams.resultsPerPage)}
            value={pageNumber}
            onChange={setPageNumber}
          />
        </div>
      </div>
    </>
  );
}