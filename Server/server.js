require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./configDB/configdb");
const errorHandler = require("./middleware/error");
const http = require("http");
const WebSocket = require("ws");
const mqtt = require("mqtt");

const MQTT_BROKER_URL = "mqtt://test.mosquitto.org"; //
const MQTT_TOPIC = "::MQTT_topic::";

connectDB();

const app = express();

app.use(express.json());

app.use("/api/authenticate", require("./routes/authenticate"));
app.use("/api/authorize", require("./routes/authorize"));
app.use("/api/devices", require("./routes/DeviceRouter"));
app.use("/api/channels", require("./routes/ChannelRouter"));
app.use("/api/measurements", require("./routes/MeasurementRouter"));
app.use("/api/active_measurements", require("./routes/ActiveMeasurementRouter"))

// Importuj modele urządzeń i kanałów
const {Device, Channel, Measurement, ActiveMeasurements} = require("./models/Measurement");

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
  });

  ws.on("close", () => {
    console.log(`${ws.type} Disconnected!`);
  });
});

const mqttClient = mqtt.connect(MQTT_BROKER_URL);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (!err) {
      console.log(`Subscribed to MQTT topic: ${MQTT_TOPIC}`);
    }
  });

  mqttClient.on("message", async (topic, message) => {
    try {
        console.log("gained message");
      const data = JSON.parse(message);
  
        console.log(data);
            // Sprawdź, czy w bazie danych istnieje kanał o określonym typie
        const channel = await Channel.findOne({ type: data.type });
        console.log(channel);

      // Sprawdź, czy w bazie danych istnieje urządzenie o danym MAC adresie
      const device = await Device.findOne({ MAC: data.MAC });

      console.log(device);
  

  
      console.log(device._id, " + ", channel._id);

      if (device && channel) {
        const newMeasurement = new Measurement({
          value: data.value,
          device: device._id,
          channel: channel._id,
          timestamp: data.timestamp,
          status: data.status,
        });
  
        await newMeasurement.save(); // Zapisz nowy pomiar w bazie danych
        console.log("Measurement saved to the database.");
  
        // Tworzenie wiadomości WebSocket
        const wsData = {
          type: "SENSOR",
          data: {
            measurement: newMeasurement,
            device,
            channel,
          },
        };
  
        // Przekazanie danych przez WebSocket do wszystkich połączonych klientów
        console.log("wysyłam dane na websocket");
        for (const client of CLIENTS) {
          client.send(JSON.stringify(wsData));
        }
        console.log("Measurement data sent to WebSocket clients.");
      } else {
        console.error("Device with the specified MAC or Channel with the specified type not found in the database.");
      }
    } catch (error) {
      console.error("Error processing MQTT message: " + error.message);
    }
  });



});



const PORT = process.env.PORT || 5000;

const serverListener = server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  serverListener.close(() => process.exit(1));
});


// mosquitto_pub.exe -h test.mosquitto.org -t "::MQTT_topic::" -m "{\"MAC\":\"00:1A:2B:3C:4D:5E\",\"type\":\"Temperature\",\"value\":20,\"timestamp\":1636200000,\"status\":\"OK\"}"
