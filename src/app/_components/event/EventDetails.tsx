import { readableDate } from "@/app/_helpers/readableDate";
import { IndividualEventDetails } from "@/types/event";
import { Button, Card, Image, Pill, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";

export default function EventDetails(props: {
  currentlyOpenEvent: IndividualEventDetails | undefined
}): React.JSX.Element {
  const [savedEvents, setSavedEvents] = useState<string[]>([]);

  const getSavedEvents = () => {
    const savedEvents = localStorage.getItem("SAVED_EVENTS");
    if (savedEvents) {
      setSavedEvents(JSON.parse(savedEvents));
    }
  }

  const handleEventSave = (event: IndividualEventDetails | undefined) => {
    if (!event) {
      return;
    }

    const savedEventsCopy = [...savedEvents];
    savedEventsCopy.push(event.id);
    setSavedEvents(savedEventsCopy);
    localStorage.setItem("SAVED_EVENTS", JSON.stringify(savedEventsCopy));
  }

  useEffect(getSavedEvents, []);

  return (
    <Card>
      <Card.Section>
        <Image
          src={props.currentlyOpenEvent?.image?.url}
          height={props.currentlyOpenEvent?.image?.height}
          width={props.currentlyOpenEvent?.image?.width}
        />
      </Card.Section>

      <div className="details">
        <Title order={3}>{props.currentlyOpenEvent?.name}</Title>
        <Title order={5}>{props.currentlyOpenEvent?.category}</Title>

        <div className="dates">
          <Pill>{readableDate(props.currentlyOpenEvent?.start)}</Pill>→<Pill>{readableDate(props.currentlyOpenEvent?.end)}</Pill>
        </div>

        <div className="save">
          <Button
            onClick={() => handleEventSave(props.currentlyOpenEvent)}
            disabled={!props.currentlyOpenEvent || savedEvents.includes(props.currentlyOpenEvent.id)}
          >Save
          </Button>
        </div>

        <div dangerouslySetInnerHTML={{ __html: props.currentlyOpenEvent?.description ?? "" }} />
      </div>

    </Card>
  );
}