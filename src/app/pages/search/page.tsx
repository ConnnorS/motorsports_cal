"use client";

import AlertsBanner from "@/app/_components/alert/AlertsBanner";
import EventDetails from "@/app/_components/event/EventDetails";
import { UseAlertsStore } from "@/app/_store/alertsStore";
import { UseSearchPageStore } from "@/app/_store/searchPageStore";
import { IndividualEvent, IndividualEventDetails } from "@/types/event";
import { MotorsportsCalAlertSeverity } from "@/types/motorsportsCalAlert";
import { Modal, Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import AdvancedSearch from "../../_components/search/AdvancedSearch/AdvancedSearch";
import SearchResultCard from "../../_components/SearchResultCard/SearchResultCard";
import { eventSearch, getEventDetails } from "../../_search/eventSearch";
import "./searchPage.scss";

export default function SearchPage(): React.JSX.Element {
  const searchPageStore = UseSearchPageStore();
  const alertsStore = UseAlertsStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentlyOpenEvent, setCurrentlyOpenEvent] = useState<IndividualEventDetails | undefined>(undefined);

  const handleAdvancedSearch = async () => {
    setIsLoading(true);

    const result = await eventSearch(
      searchPageStore.searchParams.start,
      searchPageStore.searchParams.end,
      searchPageStore.searchParams.venues,
      searchPageStore.searchParams.title,
      true
    );

    if (result instanceof Error) {
      alertsStore.addAlert({
        title: "Error",
        body: result.message,
        severity: MotorsportsCalAlertSeverity.ERROR
      });
    }
    else if (result.length === 0) {
      alertsStore.addAlert({
        title: "Warning",
        body: "No events found",
        severity: MotorsportsCalAlertSeverity.WARN
      });
    }
    else {
      searchPageStore.setSearchResults(result);
    }

    setIsLoading(false);
  };

  const handleEventClick = async (event: IndividualEvent) => {
    open();

    const eventDetails = await getEventDetails(event.rawId, event.venue);
    if (eventDetails instanceof Error) {
      alert(eventDetails.message);
    }
    else {
      setCurrentlyOpenEvent(eventDetails);
    }
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

      <AlertsBanner />

      <div className="searchPage">
        <AdvancedSearch
          searchParams={searchPageStore.searchParams}
          setSearchParams={searchPageStore.setSearchParams}
          handleEventSearch={handleAdvancedSearch}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <div className="searchResults">
          {searchPageStore.searchResults
            .slice((searchPageStore.pageNumber - 1) * searchPageStore.searchParams.resultsPerPage, searchPageStore.pageNumber * searchPageStore.searchParams.resultsPerPage)
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
            total={searchPageStore.searchResults.length / searchPageStore.searchParams.resultsPerPage}
            value={searchPageStore.pageNumber}
            onChange={searchPageStore.setPageNumber}
          />
        </div>
      </div>
    </>
  );
}