import { SupportedVenues } from "@/app/_constants/supportedVenues";

export type SelectedVenues = Record<keyof typeof SupportedVenues, boolean>;
