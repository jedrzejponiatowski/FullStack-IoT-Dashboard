const mqtt = require("mqtt");

const MQTT_BROKER_URL = "mqtt://test.mosquitto.org";
const MQTT_TOPIC_TEMPERATURE = "::MQTT_topic::";

const client = mqtt.connect(MQTT_BROKER_URL);

client.on("connect", () => {
    const data = `{"MAC":"00:1A:2B:3C:4D:5E","type":"Temperature","value":${Math.floor(Math.random() * 41)},"timestamp":${Date.now()},"status":"OK"}`;
    client.publish(MQTT_TOPIC_TEMPERATURE, data);
    /*
  setInterval(() => {
    const data = `{"MAC":"00:1A:2B:3C:4D:5E","type":"Temperature","value":${Math.floor(Math.random() * 41)},"timestamp":${Date.now()},"status":"OK"}`;
    client.publish(MQTT_TOPIC_TEMPERATURE, data);
  }, 4000);

  
  setInterval(() => {
    const data = `{"MAC":"00:1A:2B:3C:4D:00","type":"Temperature","value":${Math.floor(Math.random() * 41)},"timestamp":${Date.now()},"status":"OK"}`;
    client.publish(MQTT_TOPIC_TEMPERATURE, data);
  }, 6000);
*/
  /*
  setInterval(() => {
    const data = `{"MAC":"00:1A:2B:3C:4D:00","type":"Temperature","value":${Math.floor(Math.random() * 41)},"timestamp":${Date.now()},"status":"OK"}`;
    client.publish(MQTT_TOPIC_TEMPERATURE, data);
  }, 6000);

  setInterval(() => {
    const data = `{"MAC":"00:1A:2B:3C:4D:33","type":"Temperature","value":${Math.floor(Math.random() * 41)},"timestamp":${Date.now()},"status":"OK"}`;
    client.publish(MQTT_TOPIC_TEMPERATURE, data);
  }, 7000);
  */
});

client.on("message", (topic, message) => {
  console.log("Received message on topic:", topic, "Message:", message.toString());
});
