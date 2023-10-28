require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./configDB/configdb");
const errorHandler = require("./middleware/error");
const http = require("http");
const WebSocket = require("ws");
const mqtt = require("mqtt");

const MQTT_BROKER_URL = "mqtt://test.mosquitto.org"; //
const MQTT_TOPIC_TEMPERATURE = "MQTT_topic::temperature";

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
  });

  ws.on("close", () => {
    console.log(`${ws.type} Disconnected!`);
  });
});

const mqttClient = mqtt.connect(MQTT_BROKER_URL);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  mqttClient.subscribe(MQTT_TOPIC_TEMPERATURE, (err) => {
    if (!err) {
      console.log(`Subscribed to MQTT topic: ${MQTT_TOPIC_TEMPERATURE}`);
    }
  });



  mqttClient.on("message", (MQTT_TOPIC, message) => {
    // Przetwarzanie otrzymanej wiadomości MQTT
    try {
      const sensorData = JSON.parse(message);

      // Sprawdź, czy otrzymane dane są w odpowiednim formacie
      if (
        sensorData &&
        sensorData.sensorType &&
        //sensorData.sensorRef &&
        sensorData.sensorStatus &&
        sensorData.timestamp &&
        (sensorData.sensorValue >=0)
      ) {
        // Tworzenie odpowiedniej struktury danych dla WebSocket
        const data = {
          type: "SENSOR",
          sensorData: {
            sensorType: sensorData.sensorType,
            sensorRef: sensorData.sensorRef,
            sensorStatus: sensorData.sensorStatus,
            timestamp: sensorData.timestamp,
            sensorValue: sensorData.sensorValue,
          },
        };
        console.log("wysylam dane na websocket")
        console.log(JSON.stringify(data))
        // Wysłanie danych do klientów WebSocket
        for (const client of CLIENTS) {
          client.send(JSON.stringify(data));
        }
      } else {
        console.error("Otrzymane dane MQTT są w niepoprawnym formacie.");
        console.log(JSON.stringify(sensorData));
      }
    } catch (error) {
      console.error("Błąd przetwarzania wiadomości MQTT: " + error.message);
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


//mosquitto_pub -h test.mosquitto.org -t "poniajed_sensor1" -m "{\"sensorType\":\"photoresistor\",\"sensorStatus\":\"Light\",\"timestamp\":1697879661431,\"sensorValue\":14}"