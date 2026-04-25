import { SupportedVenues } from "@/app/_constants/supportedVenues";
import { AdvancedSearchParams } from "@/types/advancedSearch";
import { Button, MultiSelect, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { SetStateAction } from "react";

export default function AdvancedSearch(props: {
  searchParams: AdvancedSearchParams,
  setSearchParams: React.Dispatch<SetStateAction<AdvancedSearchParams>>,
  handleEventSearch: () => void
}) {
  return (
    <div className="advancedSearch">
      <DateInput
        label="Start Date"
        value={props.searchParams.start}
        onChange={value => props.setSearchParams({ ...props.searchParams, start: new Date(value ?? "") })}
      />
      <DateInput
        label="End Date"
        value={props.searchParams.end}
        onChange={value => props.setSearchParams({ ...props.searchParams, end: new Date(value ?? "") })}
      />
      <TextInput
        label="Title"
        value={props.searchParams.title}
        onChange={event => props.setSearchParams({ ...props.searchParams, title: event.currentTarget.value })}
      />
      <MultiSelect
        className="venuesInput"
        label="Venues"
        data={Object.entries(SupportedVenues).map(([key, value]) => ({
          label: value.label, value: key
        }))}
        onChange={venues => props.setSearchParams({ ...props.searchParams, venues: venues as (keyof typeof SupportedVenues)[] })}
      />

      <div className="searchButton">
        <Button
          onClick={props.handleEventSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
}