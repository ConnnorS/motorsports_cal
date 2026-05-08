"use client";

import { SupportedVenues } from "@/app/_constants/supportedVenues";
import { IndividualEvent, IndividualEventDetails } from "@/types/event";
import { Card, Image, Modal, Pill, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MonthView } from "@mantine/schedule";
import React, { useEffect, useState } from "react";
import SimpleSearch from "../_components/search/SimpleSearch/SimpleSearch";
import { readableDate } from "../_helpers/readableDate";
import "./calendarPage.scss";
import { eventSearch, getEventDetails } from "../_search/eventSearch";

export type SelectedVenues = Record<keyof typeof SupportedVenues, boolean>;

export default function CalendarPage(): React.JSX.Element {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentlyOpenedEvent, setCurrentlyOpenedEvent] = useState<IndividualEventDetails | undefined>(undefined);

  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedVenues, setSelectedVenues] = useState<SelectedVenues>({
    "LAKESIDE_PARK": false,
    "QLD_RACE_WAY": false,
    "MORGAN_PARK": false,
    "WINTON_RACEWAY": false
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const [events, setEvents] = useState<IndividualEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEventSearch = async () => {
    setIsLoading(true);
    try {
      // we always search by entire month, so get the first and last days of that month
      const firstDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
      const lastDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0);

      const searchResults = await eventSearch(
        firstDayOfMonth,
        lastDayOfMonth,
        // @ts-ignore
        Object.keys(selectedVenues).filter(key => selectedVenues[key] === true),
        searchValue,
        false // don't need to sort, <Calendar> will organise the events for us
      )

      setEvents(searchResults);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEventClick = async (event: IndividualEvent) => {
    open();

    let eventDetails: IndividualEventDetails | undefined;
    eventDetails = await getEventDetails(event.id, event.venue);
    setCurrentlyOpenedEvent(eventDetails);
  }

  const handleEventClose = () => {
    setCurrentlyOpenedEvent(undefined);
    close();
  }

  /* automatically search when the calendar's date changes */
  useEffect(() => {
    handleEventSearch();
  }, [calendarDate]);

  return (
    <>
      <Modal title="Event Details" opened={opened} onClose={handleEventClose}>
        <Card>
          <Card.Section>
            <Image
              src={currentlyOpenedEvent?.image?.url}
              height={currentlyOpenedEvent?.image?.height}
              width={currentlyOpenedEvent?.image?.width}
            />
          </Card.Section>

          <div className="details">
            <Title order={3}>{currentlyOpenedEvent?.name}</Title>
            <Title order={5}>{currentlyOpenedEvent?.category}</Title>

            <div className="dates">
              <Pill>{readableDate(currentlyOpenedEvent?.start)}</Pill>→<Pill>{readableDate(currentlyOpenedEvent?.end)}</Pill>
            </div>

            <div dangerouslySetInnerHTML={{ __html: currentlyOpenedEvent?.description ?? "" }} />
          </div>

        </Card>
      </Modal>

      <div className="calendarPage">

        <div className="filters">
          <SimpleSearch
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            selectedVenues={selectedVenues}
            setSelectedVenues={setSelectedVenues}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            handleEventSearch={handleEventSearch}
          />
        </div>

        <div className="schedule">
          <MonthView
            date={calendarDate}
            onDateChange={newDate => setCalendarDate(new Date(newDate))}
            events={events as any}
            highlightToday={true}
            // @ts-ignore
            onEventClick={handleEventClick}
          />
        </div>

      </div>
    </>
  );
}