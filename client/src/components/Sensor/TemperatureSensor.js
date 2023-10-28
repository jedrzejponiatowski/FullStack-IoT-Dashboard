import React, { useEffect, useState } from "react";
import "./Sensor.css";
import "./DataBar.css";
import DataBar from "./DataBar";

const numberOfBars = 2;

const getSensorValues = (SensorParams) => {
  return SensorParams.map((sensorParam) => sensorParam.sensorData.sensorValue);
};

const getSensorLabels = (SensorParams) => {
    return SensorParams.map((sensorParam) => sensorParam.sensorData.sensorType + sensorParam.sensorData.sensorRef);
};

const SensorInfo = {
  deviceStatus: "Offline",
  sensorStatus: "Not Available",
  sensorLastUpdated: "Not Available",
};

const SensorParams = Array.from({ length: numberOfBars }, () => ({
  sensorInfo: { ...SensorInfo },
  sensorData: {
    sensorValue: 0,
  },
}));

const TemperatureSensor = ({ sensorConfig, sensorData }) => {
  const [isParameterListExpanded, setIsParameterListExpanded] = useState(
    Array(numberOfBars).fill(false)
  );

  useEffect(() => {
    if (sensorData.sensorRef !== undefined && sensorData.sensorRef < numberOfBars) {
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
    //console.log(getSensorValues(SensorParams));
  }, [sensorData, sensorConfig]);

  return (
    <div className="sensor-container">
      {SensorParams.map((sensorParam, index) => (
        <div className="sensor-text" key={index}>
          <div className="sensor-text-heading">
            <h2
              onClick={() => {
                const expandedStates = [...isParameterListExpanded];
                expandedStates[index] = !expandedStates[index];
                setIsParameterListExpanded(expandedStates);
              }}
            >
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
        </div>
      ))}
      <div className="sensor-chart">
        <DataBar sensorConfig={sensorConfig} sensorLabels={getSensorLabels(SensorParams)} sensorValues={getSensorValues(SensorParams)} />
      </div>
    </div>
  );
};

export default TemperatureSensor;
