import { NumberInputCssVariables } from "@mantine/core"

export type WintonRacewayApiResponse = {
  status: number,
  data: {
    widgets: Record<string, WintonRacewayWidgetDetails>
  }
}

export type WintonRacewayWidgetDetails = {
  status: number,
  data: {
    app: string,
    settings: {
      events: WintonRacewayEvent[]
    }
  }
}

export type WintonRacewayEvent = {
  id: string,
  name: string,
  description: string,
  repeatFrequency?: "weekly",
  repeatInterval?: number,
  start: { type: "datetime", date: string, time: string },
  end: { type: "datetime", date: string, time: string },
  timeZone: "string",
  image: {
    url: string,
    name: string,
    width: number,
    height: number
  }
}