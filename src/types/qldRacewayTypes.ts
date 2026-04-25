export type QldRacewayEvent = {
  id: number;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  textColor: string;
}

export type QldRacewayEventDetails = {
  id: number;
  name: string;
  venue: QldRacewayEventVenue;
  title: QldRacewayEventTitle;
  category: QldRacewayEventCategory;
  start_time: string;
  end_time: string;
  calendar_content: string;
  image: QldRacewayEventImage;
}

export type QldRacewayEventVenue = {
  id: number;
  name: string;
  colour: string;
}
export type QldRacewayEventTitle = {
  id: number;
  name: string;
}

export type QldRacewayEventCategory = {
  id: number;
  name: string;
}

export type QldRacewayEventImage = {
  aspect: string;
  url: string;
  width: number;
  height: number;
  orig_width: number;
  orig_height: number;
}