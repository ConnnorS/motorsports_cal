import { QldRacewayEvent } from "./qldRacewayTypes";

// Lakeside shares the same API software as QldRaceway so the responses are the same
export type LakesideParkEvent = QldRacewayEvent;

export type LakesideParkEventDetails = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  description: string;
}