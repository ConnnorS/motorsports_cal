import { UseAlertsStore } from "@/app/_store/alertsStore";
import { Alert, Button, Text } from "@mantine/core";
import React, { useState } from "react";
import "./AlertsBanner.scss";

export default function AlertsBanner(): React.JSX.Element {
  const alertsStore = UseAlertsStore();
  const [activeAlertIndex, setActiveAlertIndex] = useState<number>(0);

  const handleAlertClose = (index: number) => {
    const alertCount = alertsStore.alerts.length;
    // if we have one or two alerts then we delete
    // the selected one and go back to the start
    if (alertCount === 1 || alertCount === 2) {
      alertsStore.removeAlert(index);
      setActiveAlertIndex(0);
    }
    // if we've deleted the last alert in the array
    // then we remove it and set the active index to
    // the previously second-last (now last) alert
    else if (index === (alertCount - 1)) {
      alertsStore.removeAlert(index);
      setActiveAlertIndex(alertCount - 2);
    }
    // if we're removing the first alert in the array
    // then just remove it and show the next one
    else if (index === 0) {
      alertsStore.removeAlert(index);
    }
    // if we've deleted an alert in the middle of
    // the array then we remove it and set the active
    // index to the previous alert
    else {
      alertsStore.removeAlert(index);
      setActiveAlertIndex(activeAlertIndex - 1);
    }
  }

  const handleNextAlert = () => {
    setActiveAlertIndex(activeAlertIndex + 1);
  }
  const handlePreviousAlert = () => {
    setActiveAlertIndex(activeAlertIndex - 1);
  }

  return (
    <div className="alertsBanner">
      {alertsStore.alerts.length > 0 ?
        <>
          <div className="alert">
            <Alert
              color={alertsStore.alerts[activeAlertIndex].severity}
              title={alertsStore.alerts[activeAlertIndex].title}
              withCloseButton={true}
              onClose={() => handleAlertClose(activeAlertIndex)}
            >
              {alertsStore.alerts[activeAlertIndex].body}
            </Alert>
          </div>
          <div className="nav">
            <Button
              size="xs"
              disabled={alertsStore.alerts.length <= 1 || activeAlertIndex === 0}
              color="var(--color-btn-primary)"
              onClick={handlePreviousAlert}
            >{"<"}</Button>
            <Text>{activeAlertIndex + 1}/{alertsStore.alerts.length}</Text>
            <Button
              size="xs"
              disabled={alertsStore.alerts.length <= 1 || activeAlertIndex === (alertsStore.alerts.length - 1)}
              color="var(--color-btn-primary)"
              onClick={handleNextAlert}
            >{">"}</Button>
          </div></>
        :
        <></>
      }
    </div>
  );
}