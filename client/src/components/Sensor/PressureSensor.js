import React, { useEffect, useState } from "react";
import DataPolarArea from "./DataPolarArea";
import "./sensor.css"

const numberOfCharts = 2;

const PressureSensor = ({ sensorConfig, sensorData }) => {
  const [sensorParams, setSensorParams] = useState(
    Array.from({ length: numberOfCharts }, () => ({
      sensorInfo: {
        deviceStatus: "Offline",
        sensorStatus: "Not Available",
        sensorLastUpdated: "Not Available",
      },
      sensorData: {
        sensorValue: 1110,
      },
    }))
  );

  const [isParameterListExpanded, setIsParameterListExpanded] = useState(
    Array(numberOfCharts).fill(false)
  );

  useEffect(() => {
    if (sensorData.sensorRef !== undefined && sensorData.sensorRef < numberOfCharts) {
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

    var DataTimeCheck = setInterval(() => {
        setSensorParams((prevParams) => {
          const updatedParams = [...prevParams];
          updatedParams.forEach((param, index) => {
            if (param.sensorInfo.deviceStatus === "Online" && param.sensorData.timestamp) {
              const currentTime = Date.now();
              const timeDifference = currentTime - param.sensorData.timestamp;
              if (timeDifference > 10000) {
                updatedParams[index] = {
                  ...param,
                  sensorInfo: {
                    ...param.sensorInfo,
                    deviceStatus: "Offline",
                    sensorStatus: "Not Available",
                  },
                };
              }
            }
          });
          return updatedParams;
        });
      }, 15000);
  
    return () => {
        clearInterval(DataTimeCheck);
    };
  }, [sensorData, sensorConfig]);

  const getSensorValues = (sensorParams) => {
    return sensorParams.map((sensorParam) => sensorParam.sensorData.sensorValue);
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
      <div className="sensor-chart-polar">
        <DataPolarArea sensorConfig={sensorConfig} sensorValues={getSensorValues(sensorParams)} />
      </div>
    </div>
  );
};

export default PressureSensor;
