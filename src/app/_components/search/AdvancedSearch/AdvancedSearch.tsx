import { SupportedVenues } from "@/app/_constants/supportedVenues";
import { AdvancedSearchParams } from "@/types/advancedSearch";
import { Button, MultiSelect, Pill, Text, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { SetStateAction, useState } from "react";

export default function AdvancedSearch(props: {
  searchParams: AdvancedSearchParams,
  setSearchParams: React.Dispatch<SetStateAction<AdvancedSearchParams>>,
  handleEventSearch: () => void,
  isLoading: boolean,
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
}) {
  const [currentTitleInput, setCurrentTitleInput] = useState<string>("");

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
      <div className="titleInputContainer">
        <TextInput
          label="Title"
          placeholder="Enter search term and press Enter"
          value={currentTitleInput}
          onChange={event => setCurrentTitleInput(event.currentTarget.value)}
          onKeyDown={event => {
            if (event.key === 'Enter' && currentTitleInput.trim() !== '') {
              props.setSearchParams({
                ...props.searchParams,
                title: [...props.searchParams.title, currentTitleInput.trim()]
              });
              setCurrentTitleInput("");
            }
          }}
        />
        {props.searchParams.title.length > 0 && (
          <div className="titlePills">
            {props.searchParams.title.map((value, index) => (
              <Pill
                key={index}
                withRemoveButton
                onRemove={() => {
                  props.setSearchParams({
                    ...props.searchParams,
                    title: props.searchParams.title.filter((_, i) => i !== index)
                  });
                }}
              >
                {value}
              </Pill>
            ))}
          </div>
        )}
      </div>
      <MultiSelect
        className="venuesInput"
        label="Venues"
        data={Object.entries(SupportedVenues).map(([key, value]) => ({
          label: value.label, value: key
        }))}
        onChange={venues => props.setSearchParams({ ...props.searchParams, venues: venues as (keyof typeof SupportedVenues)[] })}
      />

      <div className="searchButton">
        <Text>.</Text>
        <Button
          onClick={props.handleEventSearch}
          color="var(--color-btn-primary)"
          loading={props.isLoading}
          disabled={props.searchParams.venues.length === 0}
        >
          Search
        </Button>
      </div>
    </div>
  );
}