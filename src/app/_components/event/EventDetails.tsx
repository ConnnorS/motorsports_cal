import { readableDate } from "@/app/_helpers/readableDate";
import { UseSavedEventsStore } from "@/app/_store/savedEventsStore";
import { IndividualEventDetails } from "@/types/event";
import { Button, Card, Image, Pill, Title } from "@mantine/core";
import React from "react";

export default function EventDetails(props: {
  currentlyOpenEvent: IndividualEventDetails | undefined
}): React.JSX.Element {
  const savedEventsStore = UseSavedEventsStore();

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
            onClick={() => savedEventsStore.addSavedEvent(props.currentlyOpenEvent!.id)}
            disabled={!props.currentlyOpenEvent || savedEventsStore.savedEvents.includes(props.currentlyOpenEvent.id)}
          >Save
          </Button>
        </div>

        <div dangerouslySetInnerHTML={{ __html: props.currentlyOpenEvent?.description ?? "" }} />
      </div>

    </Card>
  );
}