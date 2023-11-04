import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from 'react-router-dom';
import Navbar from "../NavBar/NavBar";
import { TemperatureConfig, HumidityConfig, PressureConfig, LuminousConfig} from "./sensorConfigs";
import TemperatureSensor from "../Sensor/TemperatureSensor";
import HumiditySensor from "../Sensor/HumiditySensor";
import PressureSensor from "../Sensor/PressureSensor";
import LuminousSensor from "../Sensor/LuminousSensor";

const Dashboard = () => {
  const [error, setError] = useState("");
  const [sensorData_temperature, setSensorData_temperature] = useState({});
  const [sensorData_humidity, setSensorData_humidity] = useState({});
  const [sensorData_pressure, setSensorData_pressure] = useState({});
  const [sensorData_luminous, setSensorData_luminous] = useState({});
  const ws = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    }

    const connectWebSocket = () => {
      ws.current = new WebSocket("ws://localhost:5000");
      const jsonClientType = {
        type: "CLIENT",
      };

      ws.current.onopen = () => {
        console.log("Connected to Server!");
        ws.current.send(JSON.stringify(jsonClientType));
      };

      ws.current.onerror = (error) => {
        console.log(`Error: ${error}`);
      };

      ws.current.onclose = () => {
        console.log("Disconnected from Server!");
        // Implement Reconnecting Method
      };

      ws.current.onmessage = ({ data }) => {
        const messageText = data; // Konwersja bufora na tekst
        console.log(messageText);
        const parsedMessage = JSON.parse(messageText);
        switch (parsedMessage.sensorData.sensorType) {
            case "temperature":
                setSensorData_temperature(parsedMessage.sensorData);
                break;
            case "humidity":
                setSensorData_humidity(parsedMessage.sensorData);
                break;
            case "pressure":
                setSensorData_pressure(parsedMessage.sensorData);
                break;
            case "luminous":
                setSensorData_luminous(parsedMessage.sensorData);
                break;
            default:
        }
    
      };
    };

    const authenticate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/authorize", config);
        if (data.data === "ACCESS_GRANTED") {
          connectWebSocket();
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
        setTimeout(() => {
            navigate("/login");
        }, 3000);
      }
    };

    authenticate();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [navigate]);

  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <>
      <div className="Navbar">
        <Navbar />
      </div>
      
      <div className="TemperatureData">
        <TemperatureSensor sensorConfig={TemperatureConfig} sensorData={sensorData_temperature}/>
      </div>
      <div className="HumidityData">
        <HumiditySensor sensorConfig={HumidityConfig} sensorData={sensorData_humidity}/>
      </div>
      <div className="PressureData">
        <PressureSensor sensorConfig={PressureConfig} sensorData={sensorData_pressure}/>
      </div>
      <div className="LuminousData">
        <LuminousSensor sensorConfig={LuminousConfig} sensorData={sensorData_luminous}/>
      </div>
    </>
  );
};

export default Dashboard;
