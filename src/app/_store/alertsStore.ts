import { MotorsportsCalAlert, MotorsportsCalAlertSeverity } from "@/types/motorsportsCalAlert";
import { create } from "zustand";

interface AlertsStore {
  alerts: MotorsportsCalAlert[],
  addAlert(newAlert: MotorsportsCalAlert): void,
  removeAlert(index: number): void
}

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