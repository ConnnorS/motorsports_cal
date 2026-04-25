import { IndividualEvent } from "@/types/event";
import { Card, Pill, Title } from "@mantine/core";
import React from "react";
import "./SearchResultCard.scss";
import { readableDate } from "@/app/_helpers/readableDate";

export default function SearchResultCard(props: {
  value: IndividualEvent
}): React.JSX.Element {
  return (
    <Card className="searchResultCard"
      shadow="sm"
      withBorder={true}
      style={{ background: props.value.color }}
    >
      <div className="image">
        {/* to do */}
      </div>

      <div className="title">
        <Title order={5}>{props.value.title}</Title>
      </div>

      <div className="dates">
        <Pill>{readableDate(props.value.start)}</Pill>→<Pill>{readableDate(props.value.end)}</Pill>
      </div>
    </Card>
  );
}