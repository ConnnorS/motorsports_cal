import { Button, Checkbox, Divider, Pill, TextInput, Title } from "@mantine/core";
import React, { useState } from "react";
import { SupportedVenues } from "../../../_constants/supportedVenues";
import { SelectedVenues } from "@/types/selectedVenues";


export default function SimpleSearch(props: {
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  selectedVenues: SelectedVenues,
  setSelectedVenues: (value: SelectedVenues) => void,
  searchValues: string[],
  addSearchValue(value: string): void,
  deleteSearchValue(index: number): void,
  handleEventSearch: () => void
}): React.JSX.Element {
  const [currentInput, setCurrentInput] = useState<string>("");

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
                props.setSelectedVenues({ ...props.selectedVenues, [venueKey]: checked });
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
            value={currentInput}
            // disable search if we're loading or no venues are selected
            disabled={props.isLoading || Object.values(props.selectedVenues).every(selected => selected === false)}
            onChange={event => setCurrentInput(event.currentTarget.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && currentInput.trim() !== '') {
                props.addSearchValue(currentInput.trim());
                setCurrentInput("");
              }
            }}
          />
          {props.searchValues.length > 0 && (
            <div className="searchPills">
              {props.searchValues.map((value, index) => (
                <Pill
                  key={index}
                  withRemoveButton
                  onRemove={() => {
                    props.deleteSearchValue(index);
                  }}
                >
                  {value}
                </Pill>
              ))}
            </div>
          )}
        </div>
      </div>

      <Divider size="lg" />

      <div className="confirm">
        <Button
          color="var(--color-btn-primary)"
          onClick={props.handleEventSearch}
          loading={props.isLoading}
        >Search</Button>
      </div>
    </>
  );
}