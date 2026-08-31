import { MotorsportsCalAlert } from "@/types/motorsportsCalAlert";
import { create } from "zustand";

interface AlertsStore {
  alerts: MotorsportsCalAlert[],
  addAlert(newAlert: MotorsportsCalAlert): void,
  removeAlert(index: number): void
}

/**
 * Zustand store to store an array of alerts across the application
 */
export const UseAlertsStore = create<AlertsStore>()(set => ({
  alerts: [],
  addAlert: (newAlert: MotorsportsCalAlert) => set(state => ({ alerts: [...state.alerts, newAlert] })),
  removeAlert: (index: number) => set(state => {
    if (!state.alerts[index]) {
      return { alerts: state.alerts }
    }
    else {
      return { alerts: state.alerts.filter((_, i) => i !== index) }
    }
  })
}));