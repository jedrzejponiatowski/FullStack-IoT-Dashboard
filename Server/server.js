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

app.use("/api/devices", require("./routes/DeviceRouter"));
app.use("/api/channels", require("./routes/ChannelRouter"));
app.use("/api/measurements", require("./routes/MeasurementRouter"));
app.use("/api/active_measurements", require("./routes/ActiveMeasurementRouter"))

// Importuj modele urządzeń i kanałów
const {Device, Channel, Measurement, ActiveMeasurements} = require("./models/Measurement");

const temporaryMeasurements = [];

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

mqttClient.on("connect", async () => {
    console.log("Connected to MQTT broker");
  
    mqttClient.subscribe(MQTT_TOPIC, async (err) => {
      if (!err) {
        console.log(`Subscribed to MQTT topic: ${MQTT_TOPIC}`);
      }
    });
  
    mqttClient.on("message", async (topic, message) => {
        try {
          const data = JSON.parse(message);
      
          // Sprawdź, czy w bazie danych istnieje kanał o określonym typie
          const channel = await Channel.findOne({ type: data.type });
      
          // Sprawdź, czy w bazie danych istnieje urządzenie o danym MAC adresie
          const device = await Device.findOne({ MAC: data.MAC });
      
          if (device && channel) {
            // Sprawdź, czy w kolekcji ActiveMeasurements istnieje wpis z danym urządzeniem i kanałem
            const activeMeasurement = await ActiveMeasurements.findOne({
              device: device._id,
              channel: channel._id,
            });
      
            if (activeMeasurement) {
              // Znajdź odpowiadający pomiar w tablicy temporaryMeasurements
              const matchingMeasurement = temporaryMeasurements.find((tempMeasurement) => {
                return (
                  tempMeasurement.device.toString() === device._id.toString() &&
                  tempMeasurement.channel.toString() === channel._id.toString()
                );
              });
      
              if (matchingMeasurement) {
                // Aktualizuj wartość pomiaru, zachowaj timestamp
                matchingMeasurement.value = data.value;
                matchingMeasurement.status = data.status;
      
                console.log("Measurement updated in temporaryMeasurements.");
              } else {
                console.error("Matching measurement not found in temporaryMeasurements.");
              }
            } else {
              console.error("ActiveMeasurement not found in the database.");
            }
          } else {
            console.error("Device or Channel not found in the database.");
          }
        } catch (error) {
          console.error("Error processing MQTT message: " + error.message);
        }
      });
  
    // Połącz się z bazą danych i pobierz aktualne ActiveMeasurements
    const activeMeasurements = await ActiveMeasurements.find();
    const currentTime = new Date().getTime(); // Define currentTime here
  
    // Wypełnij tablicę temporaryMeasurements
    temporaryMeasurements.length = 0; // Wyczyść tablicę, aby uniknąć duplikatów
  
    activeMeasurements.forEach(activeMeasurement => {
      temporaryMeasurements.push(new Measurement({
        value: -99,
        device: activeMeasurement.device,
        channel: activeMeasurement.channel,
        timestamp: currentTime,
        status: "UNKNOWN",
      }));
    });
  
    console.log(`${temporaryMeasurements.length} Temporary Measurements initialized.`);
  });
  
  setInterval(async () => {
    const currentTime = new Date().getTime(); // Define currentTime here
  
    // Zapisz tymczasowe measurements do bazy danych co 20 sekund
    if (temporaryMeasurements.length > 0) {
      await Measurement.insertMany(temporaryMeasurements);
      console.log(`${temporaryMeasurements.length} Temporary Measurements saved to the database.`);
  
      // Wyczyść tablicę temporaryMeasurements
      temporaryMeasurements.length = 0;
  
      // Ponownie zainicjuj temporaryMeasurements na podstawie aktualnej liczby ActiveMeasurements
      const activeMeasurements = await ActiveMeasurements.find();
      activeMeasurements.forEach((activeMeasurement) => {
        temporaryMeasurements.push(
          new Measurement({
            value: -99,
            device: activeMeasurement.device,
            channel: activeMeasurement.channel,
            timestamp: currentTime,
            status: "UNKNOWN",
          })
        );
      });
  
      console.log(`${temporaryMeasurements.length} Temporary Measurements re-initialized.`);
    }
  }, 20000);



const PORT = process.env.PORT || 5000;

const serverListener = server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  serverListener.close(() => process.exit(1));
});


// mosquitto_pub.exe -h test.mosquitto.org -t "::MQTT_topic::" -m "{\"MAC\":\"00:1A:2B:3C:4D:5E\",\"type\":\"Temperature\",\"value\":20,\"timestamp\":1636200000,\"status\":\"OK\"}"
