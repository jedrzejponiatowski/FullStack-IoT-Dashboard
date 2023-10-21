const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:5000");

function LDRValue() {
  return Math.floor(Math.random() * 11); // Generuje losową liczbę z zakresu 0-10
}

ws.on("open", () => {
  let sensorValue = 0;
  let sensorStatus = (sensorValue) => {
    if (sensorValue < 5) {
      return "Light";
    } else {
      return "Dark";
    }
  };
  setInterval(() => {
    sensorValue = LDRValue();
    const data = {
      type: "SENSOR",
      sensorData: {
        sensorType: "photoresistor",
        sensorStatus: sensorStatus(sensorValue),
        timestamp: Date.now(),
        sensorValue: sensorValue,
      },
    };
    ws.send(JSON.stringify(data));
  }, 20000);
});

ws.on("message", (data) => {
  console.log(data);
});
