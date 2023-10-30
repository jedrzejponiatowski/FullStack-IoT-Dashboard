import React, { useEffect, useState } from "react";
import "./Sensor.css";
import "./DataBar.css";
import DataBar from "./DataBar";

const numberOfBars = 2;

const TemperatureSensor = ({ sensorConfig, sensorData }) => {
  const [sensorParams, setSensorParams] = useState(
    Array.from({ length: numberOfBars }, () => ({
      sensorInfo: {
        deviceStatus: "Offline",
        sensorStatus: "Not Available",
        sensorLastUpdated: "Not Available",
      },
      sensorData: {
        sensorValue: 0,
      },
    }))
  );

  const [isParameterListExpanded, setIsParameterListExpanded] = useState(
    Array(numberOfBars).fill(false)
  );

  useEffect(() => {
    if (sensorData.sensorRef !== undefined && sensorData.sensorRef < numberOfBars) {
      const sensorToUpdate = sensorData.sensorRef;
      setSensorParams((prevParams) => {
        const updatedParams = [...prevParams];
        updatedParams[sensorToUpdate] = {
          sensorInfo: {
            deviceStatus: "Online",
            sensorStatus: sensorData.sensorStatus || "Not Available",
            sensorLastUpdated: sensorData.timestamp
              ? `${new Date(sensorData.timestamp).toDateString()} at ${new Date(sensorData.timestamp).toLocaleTimeString("en-IN").replace("am", "AM").replace("pm", "PM")}`
              : "Not Available",
          },
          sensorData,
        };
        return updatedParams;
      });
    }
  }, [sensorData, sensorConfig]);

  const getSensorValues = (sensorParams) => {
    return sensorParams.map((sensorParam) => sensorParam.sensorData.sensorValue);
  };

  const getSensorLabels = (sensorParams) => {
    return sensorParams.map((sensorParam) => sensorParam.sensorData.sensorType + sensorParam.sensorData.sensorRef);
  };

  return (
    <div className="sensor-container">
      {sensorParams.map((sensorParam, index) => (
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
        <DataBar sensorConfig={sensorConfig} sensorLabels={getSensorLabels(sensorParams)} sensorValues={getSensorValues(sensorParams)} />
      </div>
    </div>
  );
};

export default TemperatureSensor;
