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
import { UseSearchPageStore } from "@/app/_store/searchPageStore";

export default function SearchPage(): React.JSX.Element {
  const pageStore = UseSearchPageStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentlyOpenEvent, setCurrentlyOpenEvent] = useState<IndividualEventDetails | undefined>(undefined);

  const handleAdvancedSearch = async () => {
    try {
      setIsLoading(true);
      const allEvents = await eventSearch(
        pageStore.searchParams.start,
        pageStore.searchParams.end,
        pageStore.searchParams.venues,
        pageStore.searchParams.title,
        true
      );
      pageStore.setSearchResults(allEvents);
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
      <Modal title="Event Details" opened={opened} onClose={handleEventClose}>
        <EventDetails currentlyOpenEvent={currentlyOpenEvent} />
      </Modal>

      <div className="searchPage">
        <AdvancedSearch
          searchParams={pageStore.searchParams}
          setSearchParams={pageStore.setSearchParams}
          handleEventSearch={handleAdvancedSearch}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <div className="searchResults">
          {pageStore.searchResults
            .slice((pageStore.pageNumber - 1) * pageStore.searchParams.resultsPerPage, pageStore.pageNumber * pageStore.searchParams.resultsPerPage)
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
            total={pageStore.searchResults.length / pageStore.searchParams.resultsPerPage}
            value={pageStore.pageNumber}
            onChange={pageStore.setPageNumber}
          />
        </div>
      </div>
    </>
  );
}