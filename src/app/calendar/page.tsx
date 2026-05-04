"use client";

import { SupportedVenues } from "@/app/_constants/supportedVenues";
import { IndividualEvent, IndividualEventDetails } from "@/types/event";
import { Card, Image, Modal, Pill, SegmentedControl, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MonthView } from "@mantine/schedule";
import React, { useEffect, useState } from "react";
import { getCmsEventDetails, getCmsEvents } from "../_api/cms";
import { getWintonRacewayEvents } from "../_api/wintonRaceway";
import SimpleSearch from "../_components/search/SimpleSearch/SimpleSearch";
import { readableDate } from "../_helpers/readableDate";
import "./calendarPage.scss";

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

      /* go through each venue and perform a search, adding to the search results as we go */
      let allEvents: IndividualEvent[] = [];
      // Queensland Raceway
      if (selectedVenues.QLD_RACE_WAY) {
        const qldRacewayEvents = await getCmsEvents(firstDayOfMonth, lastDayOfMonth, "QLD_RACE_WAY");
        if (qldRacewayEvents) {
          allEvents = allEvents.concat(qldRacewayEvents);
        }
        else {
          alert("Error searching for Queensland Raceway events");
        }
      }
      // Lakeside Park
      if (selectedVenues.LAKESIDE_PARK) {
        const lakesideParkEvents = await getCmsEvents(firstDayOfMonth, lastDayOfMonth, "LAKESIDE_PARK");
        if (lakesideParkEvents) {
          allEvents = allEvents.concat(lakesideParkEvents);
        }
        else {
          alert("Error searching for Lakeside Park events");
        }
      }
      // Morgan Park
      if (selectedVenues.MORGAN_PARK) {
        const morganParkEvents = await getCmsEvents(firstDayOfMonth, lastDayOfMonth, "MORGAN_PARK");
        if (morganParkEvents) {
          allEvents = allEvents.concat(morganParkEvents);
        }
        else {
          alert("Error searching for Morgan Park events");
        }
      }
      // Winton Raceway
      if (selectedVenues.WINTON_RACEWAY) {
        const wintonRacewayEvents = await getWintonRacewayEvents(firstDayOfMonth, lastDayOfMonth);
        if (wintonRacewayEvents) {
          allEvents = allEvents.concat(wintonRacewayEvents);
        }
        else {
          alert("Error searching for Winton Raceway events");
        }
      }

      /* remove any events with invalid date ranges */
      allEvents = allEvents.filter(event => {
        if (event.end < event.start) {
          console.log(`Event ${event.title} has end date (${event.end}) before start date (${event.start}), removing event`);
          return false;
        }
        return event;
      });

      /* now filter all events by the search phrase */
      if (searchValue) {
        allEvents = allEvents.filter(event => (
          event.title.toLowerCase().includes(searchValue.toLowerCase())
        ));
      }

      setEvents(allEvents);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEventClick = async (event: IndividualEvent) => {
    open();

    let eventDetails: IndividualEventDetails | undefined;
    eventDetails = await getCmsEventDetails(event.id, event.venue);
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