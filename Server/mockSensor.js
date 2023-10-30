const mqtt = require("mqtt");

const MQTT_BROKER_URL = "mqtt://test.mosquitto.org";
const MQTT_TOPIC_TEMPERATURE = "MQTT_topic::temperature";

const client = mqtt.connect(MQTT_BROKER_URL);

client.on("connect", () => {
    const data = `{"sensorType":"humidity", "sensorRef":${0}, "sensorStatus":"Light", "timestamp":${Date.now()}, "sensorValue":${Math.floor(Math.random() * 50)}}`;
    client.publish(MQTT_TOPIC_TEMPERATURE, data);
    /*
  setInterval(() => {
    const data = `{"sensorType":"temperature", "sensorRef":${0}, "sensorStatus":"Light", "timestamp":${Date.now()}, "sensorValue":${Math.floor(Math.random() * 50)}}`;
    client.publish(MQTT_TOPIC_TEMPERATURE, data);
  }, 7000);

  setInterval(() => {
    const data = `{"sensorType":"temperature", "sensorRef":${1}, "sensorStatus":"Dark", "timestamp":${Date.now()}, "sensorValue":${Math.floor(Math.random() * 50)}}`;
    client.publish(MQTT_TOPIC_TEMPERATURE, data);
  }, 13000);

  setInterval(() => {
    const data = `{"sensorType":"humidity", "sensorRef":${0}, "sensorStatus":"Light", "timestamp":${Date.now()}, "sensorValue":${Math.floor(Math.random() * 50)}}`;
    client.publish(MQTT_TOPIC_TEMPERATURE, data);
  }, 5000);

  setInterval(() => {
    const data = `{"sensorType":"humidity", "sensorRef":${1}, "sensorStatus":"Dark", "timestamp":${Date.now()}, "sensorValue":${Math.floor(Math.random() * 50)}}`;
    client.publish(MQTT_TOPIC_TEMPERATURE, data);
  }, 4000);
  */
});

client.on("message", (topic, message) => {
  console.log("Received message on topic:", topic, "Message:", message.toString());
});
