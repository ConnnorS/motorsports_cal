import { QldRacewayEvent } from "./qldRacewayTypes";

// Morgan Park shares the same API software as QldRaceway so the responses are the same
export type MorganParkEvent = QldRacewayEvent;

export type MorganParkEventDetails = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  calendar_content: string;
  type: {
    photo: { url: string; width: number; height: number }
  }
};