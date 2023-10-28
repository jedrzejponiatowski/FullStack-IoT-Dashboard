import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from 'react-router-dom';
import Navbar from "../NavBar/NavBar";
import { TemperatureConfig } from "./sensorConfigs";
//import Sensor from "../Sensor/Sensor";
import TemperatureSensor from "../Sensor/TemperatureSensor";

const Dashboard = () => {
  const [error, setError] = useState("");
  const [sensorData_temperature, setSensorData_temperature] = useState({});
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
        //console.log(messageText);
        const parsedMessage = JSON.parse(messageText);
        switch (parsedMessage.sensorData.sensorType) {
            case "temperature":
              setSensorData_temperature(parsedMessage.sensorData);
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
      <Navbar />
      <div className="TemperatureData">
        <TemperatureSensor sensorConfig={TemperatureConfig} sensorData={sensorData_temperature}/>
      </div>
    </>
  );
};

export default Dashboard;
