"use client";

import React from "react";
import { Card, Group, Stack, Text } from "@mantine/core";
import { IndividualEvent } from "@/types/event";
import { readableDate } from "@/app/_helpers/readableDate";
import "./SearchResultCard.scss";
import { SupportedVenues } from "@/app/_constants/supportedVenues";

export default function SearchResultCard(props: { event: IndividualEvent }): React.JSX.Element {
  return (
    <Card className="searchResultCard" radius="md" shadow="sm" withBorder>
      <Stack gap="xs">
        <Group gap="apart" align="flex-start">
          <Text className="title" fw={700} size="lg">
            {props.event.title}
          </Text>
        </Group>

        <Text className="dates" size="sm" color="dimmed">
          {readableDate(props.event.start)}
          {props.event.end ? ` — ${readableDate(props.event.end)}` : ""}
        </Text>

        <Text className="venue" style={{ color: props.event.color }} size="sm">
          {SupportedVenues[props.event.venue].label}
        </Text>
      </Stack>
    </Card>
  );
}
