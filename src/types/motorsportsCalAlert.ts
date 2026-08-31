export interface MotorsportsCalAlert {
  title: string,
  body: string,
  severity: MotorsportsCalAlertSeverity
}

export enum MotorsportsCalAlertSeverity {
  INFO = "blue",
  WARN = "orange",
  ERROR = "red"
}