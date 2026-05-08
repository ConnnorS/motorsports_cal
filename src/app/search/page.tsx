"use client";

import React, { useState } from "react";
import "./searchPage.scss";
import { AdvancedSearchParams } from "@/types/advancedSearch";
import AdvancedSearch from "../_components/search/AdvancedSearch/AdvancedSearch";
import SearchResultCard from "../_components/SearchResultCard/SearchResultCard";
import { IndividualEvent } from "@/types/event";
import { Pagination } from "@mantine/core";
import { eventSearch } from "../_helpers/search/eventSearch";

const PAGE_SIZE: number = 12;

export default function SearchPage(): React.JSX.Element {
  const [searchParams, setSearchParams] = useState<AdvancedSearchParams>({
    start: new Date(),
    end: new Date(),
    title: "",
    venues: []
  });
  const [searchResults, setSearchResults] = useState<IndividualEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);

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
        {searchResults
          .slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE)
          .map((event) => (
            <SearchResultCard key={event.id} event={event} />
          ))}
      </div>

      <div className="pagination">
        <Pagination
          total={searchResults.length / PAGE_SIZE}
          value={pageNumber}
          onChange={setPageNumber}
        />
      </div>
    </div>
  );
}