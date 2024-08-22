# FullStack IoT Dashboard
# Project Overview

This project represents a full-scale implementation of an Internet of Things (IoT) system, showcasing the capabilities of such technology. The system is divided into three distinct layers:

1. **Physical Layer**:  
   The ESP32 microcontroller collects data from temperature, humidity, light intensity, and pressure sensors using the I2C communication protocol. The data is preliminarily aggregated and processed into a suitable format before being transmitted to the server via the wireless MQTT protocol. The entire operation is managed by the freeRTOS operating system, ensuring proper synchronization and execution of threads.

2. **Server Layer**:  
   This layer features an MQTT subscriber that receives and validates the data. Once verified, the data is stored in a MongoDB database using the Express framework. The entire server layer is written in high-level JavaScript.

3. **Application Layer**:  
   The client application is implemented in JavaScript using the React framework, with components provided by MaterialUI. During development, I focused on applying UX and UI design principles, emphasizing minimalism, aesthetics, and functionality. The application allows for the configuration of additional devices within the network, management of collected measurements, and provides options for data archiving and visualization over specific time intervals.

<div align="center">
  <img src="https://github.com/user-attachments/assets/928e3266-d5d1-4f01-bda8-1f87e2020bf2" alt="data" width="800" />
    <br><br>
  <img src="https://github.com/user-attachments/assets/c7437067-367a-4b75-9ec0-84af4aa96098" alt="Archive" width="800" />
    <br><br>
  <img src="https://github.com/user-attachments/assets/3b14e99b-8b05-4484-8063-bb6d5142c066" alt="config3" width="800"/>
   <br><br>
  <img src="https://github.com/user-attachments/assets/e80a5858-7e54-4407-b1b5-73b9e9088725" alt="bme280wiring" width="500"/>
   <br><br>
  <img src="https://github.com/user-attachments/assets/0e579a7c-c7b4-4632-beb8-1d1d4dc8d84d" alt="Architektura drawio" width="700"/>
   <br><br>
  <img src="https://github.com/user-attachments/assets/3527037f-4cea-4c5c-af58-ea01c659d7e6" alt="ERD drawio" width="700"/>
</div>


