require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./configDB/configdb");
const errorHandler = require("./middleware/error");
const http = require("http");
const WebSocket = require("ws");

const MQTT_BROKER_URL = "mqtt://test.mosquitto.org"; //
const MQTT_TOPIC = "poniajed_sensor1";

const mqtt = require('mqtt');
mqttClient = mqtt.connect(MQTT_BROKER_URL);

connectDB();

const app = express();

app.use(express.json());

app.use("/api/authenticate", require("./routes/authenticate"));
app.use("/api/authorize", require("./routes/authorize"));

// Error Handler
app.use(errorHandler);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

CLIENTS = [];


wss.on("connection", function connection(ws) {
  console.log("New Device Connected!");
  
  ws.on("message", (data) => {
    console.log(data, typeof data);
    var jsonData = {};
    try {
      jsonData = JSON.parse(data);
      ws.type = jsonData.type;
      console.log(`${ws.type} Connected!`);
    } catch (error) {
      console.log(`Parse Error: ${error}`);
    }

    if (jsonData.type === "CLIENT") {
      CLIENTS.push(ws);
    }
    if (jsonData.type === "SENSOR") {
      if (CLIENTS.length > 0) {
        for (let i = 0; i < CLIENTS.length; i++) {
          CLIENTS[i].send(JSON.stringify(jsonData.sensorData));
        }
      }
    }
  });

  ws.on("close", () => {
    console.log(`${ws.type} Disconnected!`);
  });
});

mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");
  
    mqttClient.subscribe(MQTT_TOPIC, (err) => {
      if (!err) {
        console.log(`Subscribed to MQTT topic: ${MQTT_TOPIC}`);
      }
    });
  
    mqttClient.on("message", (MQTT_TOPIC, message) => {
      const sensorData = { type: "SENSOR", data: message.toString() };
  
      // Prześlij dane na WebSocket do klientów
      CLIENTS.forEach((client) => {
        client.send(JSON.stringify(sensorData));
      });
    });
});

const PORT = process.env.PORT | 5000;

const serverListener = server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  serverListener.close(() => process.exit(1));
});
