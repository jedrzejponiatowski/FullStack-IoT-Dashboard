import React, { useEffect, useState } from "react";
import "./Sensor.css";
import DataBar from "./DataBar";

const numberOfCharts = 2;

const SensorInfo = {
  deviceStatus: "Offline",
  sensorStatus: "Not Available",
  sensorLastUpdated: "Not Available",
};

const SensorParams = Array.from({ length: numberOfCharts }, () => ({
  sensorInfo: { ...SensorInfo },
  sensorData: {},
}));

const Sensor = ({ sensorConfig, sensorData }) => {
  const [isParameterListExpanded, setIsParameterListExpanded] = useState(
    Array(numberOfCharts).fill(false)
  );

  useEffect(() => {
    if (sensorData.sensorRef !== undefined && sensorData.sensorRef < numberOfCharts) {
      const sensorToUpdate = sensorData.sensorRef;
      SensorParams[sensorToUpdate].sensorData = sensorData;
      if (
        sensorData.sensorType &&
        sensorData.sensorType.toLowerCase() === sensorConfig.name.toLowerCase()
      ) {
        SensorParams[sensorToUpdate].sensorInfo.deviceStatus = "Online";
        if (sensorData.sensorStatus) {
          SensorParams[sensorToUpdate].sensorInfo.sensorStatus = sensorData.sensorStatus;
        }
        if (sensorData.timestamp) {
          SensorParams[sensorToUpdate].sensorInfo.sensorLastUpdated = `${new Date(
            sensorData.timestamp
          ).toDateString()} at ${new Date(sensorData.timestamp)
            .toLocaleTimeString("en-IN")
            .replace("am", "AM")
            .replace("pm", "PM")}`;
        }
      } else {
        SensorParams[sensorToUpdate].sensorInfo.deviceStatus = "Offline";
        SensorParams[sensorToUpdate].sensorInfo.sensorStatus = "Not Available";
        SensorParams[sensorToUpdate].sensorInfo.sensorLastUpdated = "Not Available";
      }
    }
  }, [sensorData, sensorConfig]);

  return (
    <div className="sensor-container">
      {SensorParams.map((sensorParam, index) => (
        <div className="sensor-text" key={index}>
          <div className="sensor-text-heading">
            <h2 onClick={() => {
              const expandedStates = [...isParameterListExpanded];
              expandedStates[index] = !expandedStates[index];
              setIsParameterListExpanded(expandedStates);
            }}>
              {sensorConfig.name} - Sensor {index + 1}
              {isParameterListExpanded[index] ? " -" : " +"}
            </h2>
          </div>
          {isParameterListExpanded[index] && (
            <div className="sensor-text-content">
              <p>Device Status: {sensorParam.sensorInfo.deviceStatus}</p>
              <p>Sensor Status: {sensorParam.sensorInfo.sensorStatus}</p>
              <p>Sensor Last Updated: {sensorParam.sensorInfo.sensorLastUpdated}</p>
            </div>
          )}
          <div className="sensor-chart">
            <DataBar sensorConfig={sensorConfig} sensorData={sensorParam.sensorData} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sensor;
