import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useTheme,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Typography,
  CssBaseline,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const Chart = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [uniqueDevices, setUniqueDevices] = useState([]);
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(null);
  const [chartColors, setChartColors] = useState([
    '#FF5733', // Pomarańczowy
    '#34A853', // Zielony
    '#4285F4', // Niebieski
    '#EA4335', // Czerwony
  ]);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pobieranie danych pomiarowych
        const measurementsResponse = await axios.get('/api/measurements');
        const measurementsData = measurementsResponse.data.data;

        // Tworzenie listy unikalnych urządzeń (unikalne MAC adresy)
        const devices = measurementsData.map((measurement) => measurement.device.MAC);
        const uniqueDevices = [...new Set(devices)];

        setUniqueDevices(uniqueDevices.slice(0, 4));

        // Jeśli nie ma wybranych urządzeń, ustaw wszystkie dostępne jako wybrane
        if (selectedDevices.length === 0) {
          setSelectedDevices(uniqueDevices.slice(0, 4)); // Ograniczenie do 4 urządzeń
        }

        // Tworzenie danych do wykresu tylko z wybranych urządzeń
        const chartData = uniqueDevices.slice(0, 4).map((deviceMAC, index) => {
          return {
            deviceMAC,
            data: measurementsData
              .filter((measurement) => measurement.device.MAC === deviceMAC)
              .map((measurement) => ({
                time: formatDate(measurement.timestamp),
                amount: measurement.value,
              })),
            color: chartColors[index],
          };
        });

        // Ustawianie danych do wykresu
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDevices, chartColors]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { hour: 'numeric', minute: 'numeric', hour12: false };
    return date.toLocaleTimeString('en-US', options);
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

  const handleTimeIntervalChange = (interval) => {
    // Toggle stanu wybranego interwału czasowego
    setSelectedTimeInterval((prevSelectedTimeInterval) => {
      return prevSelectedTimeInterval === interval ? null : interval;
    });
  };

  return (
    <Grid container spacing={4} style={{ height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <Grid item xs={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 550,
          }}
        >
          <Typography variant="h6" gutterBottom component="div">
            Chart
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 50, right: 20, bottom: 50, left: -10 }}>
              <CartesianGrid stroke="#bbb" strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="time" stroke={theme.palette.text.secondary} tick={{ fontSize: 16 }} />
              <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 16 }} tickCount={10} domain={[0, 40]} />
              <Legend verticalAlign="top" height={36} />
              {chartData.map((device, index) => (
                <Line
                  key={device.deviceMAC}
                  type="monotone"
                  dataKey="amount"
                  data={device.data}
                  name={device.deviceMAC}
                  stroke={device.color}
                  strokeWidth={2}
                  dot={{ strokeWidth: 2, r: 2 }}
                  connectNulls={true} // Dodane, aby po odznaczeniu checkboxa serii danych zostały usunięte
                  opacity={selectedDevices.includes(device.deviceMAC) ? 1 : 0} // Dodane, aby kontrolować widoczność serii
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 550,
          }}
        >
          <Typography variant="h6" gutterBottom component="div">
            Device List
          </Typography>
          <List>
            {uniqueDevices.slice(0, 5).map((deviceMAC) => (
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

          <Typography variant="h6" gutterBottom component="div" style={{ marginTop: '16px' }}>
            Time Interval
          </Typography>
          <List>
            {['1h', '3h', '6h'].map((interval) => (
              <React.Fragment key={interval}>
                <ListItem>
                  <Checkbox
                    checked={selectedTimeInterval === interval}
                    onChange={() => handleTimeIntervalChange(interval)}
                  />
                  <ListItemText primary={interval} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Chart;
