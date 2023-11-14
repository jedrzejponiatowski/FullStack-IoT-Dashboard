import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useTheme,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from 'recharts';
import Typography from '@mui/material/Typography';

const Chart = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [uniqueDevices, setUniqueDevices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pobieranie danych pomiarowych
        const measurementsResponse = await axios.get('/api/measurements');
        const measurementsData = measurementsResponse.data.data;

        // Tworzenie listy unikalnych urządzeń (unikalne MAC adresy)
        const devices = measurementsData.map((measurement) => measurement.device.MAC);
        const uniqueDevices = [...new Set(devices)];
        setUniqueDevices(uniqueDevices);

        // Tworzenie danych do wykresu tylko z wybranych urządzeń
        const chartData = measurementsData
          .filter((measurement) => selectedDevices.includes(measurement.device.MAC))
          .map((measurement) => ({
            time: formatDate(measurement.timestamp),
            amount: measurement.value,
            deviceMAC: measurement.device.MAC,
          }));

        // Ustawianie danych do wykresu
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDevices]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleDeviceChange = (deviceMAC) => {
    // Toggle stanu wybranego urządzenia
    setSelectedDevices((prevSelectedDevices) => {
      if (prevSelectedDevices.includes(deviceMAC)) {
        return prevSelectedDevices.filter((mac) => mac !== deviceMAC);
      } else {
        return [...prevSelectedDevices, deviceMAC];
      }
    });
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ width: '75%', paddingRight: '16px' }}>
        <Typography variant="h6" gutterBottom component="div">
          Chart
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24,
            }}
          >
            <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={theme.palette.primary.main}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1, backgroundColor: 'white' }}>
        <Typography variant="h6" gutterBottom component="div">
          Device List
        </Typography>
        <List>
          {uniqueDevices.map((deviceMAC) => (
            <React.Fragment key={deviceMAC}>
              <ListItem>
                <Checkbox
                  checked={selectedDevices.includes(deviceMAC)}
                  onChange={() => handleDeviceChange(deviceMAC)}
                />
                <ListItemText primary={deviceMAC} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>
    </div>
  );
};

export default Chart;
