import { Button, Checkbox, Divider, Select, TextInput, Title } from "@mantine/core";
import React from "react";
import { SupportedVenues } from "../../_constants/supportedVenues";
import { SelectedVenues } from "@/app/calendar/page";


export default function SimpleSearch(props: {
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  selectedVenues: SelectedVenues,
  setSelectedVenues: React.Dispatch<React.SetStateAction<SelectedVenues>>,
  searchValue: string,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
  handleEventSearch: () => void
}): React.JSX.Element {

  /**
   * Allows us to quickly select or unselect all venues
   * @param selected - select all or unselect all venues
   */
  const selectAllVenues = (selectAll: boolean) => {
    const newSelectedVenues = {};
    for (const key of Object.keys(SupportedVenues)) {
      // @ts-ignore
      newSelectedVenues[key] = selectAll;
    }
    props.setSelectedVenues(newSelectedVenues as SelectedVenues);
  }

  return (
    <>
      <div className="venues">
        <Title order={4}>Venues</Title>
        <div className="options">
          <Checkbox
            label="Select All"
            onChange={event => selectAllVenues(event.currentTarget.checked)}
            indeterminate={
              // some venues are selected, but not ALL venues are selected
              Object.values(props.selectedVenues).some(Boolean) &&
              !Object.values(props.selectedVenues).every(Boolean)
            }
          />
          <Divider size="sm" />
          {Object.keys(SupportedVenues).map(venueKey => (
            <Checkbox
              key={venueKey}
              // @ts-ignore
              color={SupportedVenues[venueKey].color}
              // @ts-ignore
              label={SupportedVenues[venueKey].label}
              // @ts-ignore
              checked={props.selectedVenues[venueKey]}
              disabled={props.isLoading}
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                props.setSelectedVenues(prev => ({ ...prev, [venueKey]: checked }));
              }}
            />
          ))}
        </div>
      </div>

      <Divider size="lg" />

      <div className="search">
        <Title order={4}>Search</Title>
        <div className="options">
          <TextInput
            placeholder="Search for keywords"
            value={props.searchValue}
            // disable search if we're loading or no venues are selected
            disabled={props.isLoading || Object.values(props.selectedVenues).every(selected => selected === false)}
            onChange={event => props.setSearchValue(event.currentTarget.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                props.handleEventSearch();
              }
            }}
          />
        </div>
      </div>

      <Divider size="lg" />

      <div className="confirm">
        <Button
          onClick={props.handleEventSearch}
          loading={props.isLoading}
        >Search</Button>
      </div>
    </>
  );
}