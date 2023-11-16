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
  Tooltip,
} from 'recharts';

const Chart = ({ measurementName }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [uniqueDevices, setUniqueDevices] = useState([]);
  const [selectedTimeInterval, setSelectedTimeInterval] = useState('1');
  const [currentAxisInterval, setCurrentAxisInterval] = useState(1);
  const [chartColors, setChartColors] = useState([
    '#FF5733', // Pomarańczowy
    '#34A853', // Zielony
    '#4285F4', // Niebieski
    '#EA4335', // Czerwony
  ]);


  useEffect(() => {
    fetchData(selectedTimeInterval, measurementName);  // Dodaj measurementName jako drugi argument
  }, [selectedDevices, selectedTimeInterval, measurementName]);

  const fetchData = async (interval, measurementName) => {
    try {
      const measurementsResponse = await axios.get('/api/measurements');
      const measurementsData = measurementsResponse.data.data;
  
      const filteredMeasurementsData = measurementsData.filter(
        (measurement) => measurement.channel.type === measurementName
      );
  
      if (filteredMeasurementsData.length === 0) {
        const placeholderMeasurement = {
          device: { MAC: 'undefined' },
          value: 0,
          timestamp: new Date().toISOString(),
        };
        filteredMeasurementsData.push(placeholderMeasurement);
      }
  
      // Oblicz timestamp, który jest równy teraźniejszemu czasowi minus 3 minuty
      const intervalMilliseconds = parseInt(interval) * 60 * 1000;
      const currentTimestamp = new Date().getTime();
      const startTime = new Date(currentTimestamp - intervalMilliseconds).toISOString();
  
      const filteredMeasurements = filteredMeasurementsData.filter(
        (measurement) => new Date(measurement.timestamp).getTime() >= new Date(startTime).getTime()
      );
  
      filteredMeasurements.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
      const devices = filteredMeasurements.map((measurement) => measurement.device.MAC);
      const uniqueDevices = [...new Set(devices)];
  
      setUniqueDevices(uniqueDevices.slice(0, 4));
  
      if (selectedDevices.length === 0) {
        setSelectedDevices(uniqueDevices.slice(0, 4));
      }
  
      const chartData = uniqueDevices.slice(0, 4).map((deviceMAC, index) => {
        return {
          deviceMAC,
          data: filteredMeasurements
            .filter((measurement) => measurement.device.MAC === deviceMAC)
            .map((measurement) => ({
              time: formatDate(measurement.timestamp),
              amount: measurement.value !== -99 ? measurement.value : null,
            })),
          color: chartColors[index],
        };
      });
  
      setChartData(chartData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { hour: 'numeric', minute: 'numeric', hour12: false };
    return date.toLocaleTimeString('en-US', options);
  };

  const handleDeviceChange = (deviceMAC) => {
    setSelectedDevices((prevSelectedDevices) => {
      if (prevSelectedDevices.includes(deviceMAC)) {
        return prevSelectedDevices.filter((mac) => mac !== deviceMAC);
      } else {
        return [...prevSelectedDevices, deviceMAC];
      }
    });
  };

  const handleTimeIntervalChange = (interval) => {
    setSelectedTimeInterval(interval);
    setCurrentAxisInterval(Number(interval) * 2);
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
            <LineChart margin={{ top: 20, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid stroke="#bbb" strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="time" stroke={theme.palette.text.secondary} tick={{ fontSize: 16 }}  />
              <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 16 }} tickCount={10} domain={[0, 40]} />
              <Legend verticalAlign="top" height={36} />
              {/* Dodajemy Tooltip dla interaktywnego podglądu */}
              <Tooltip content={<CustomTooltip />} />
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
                    connectNulls={false} // Wyłączamy łączenie null
                    opacity={selectedDevices.includes(device.deviceMAC) ? 1 : 0}
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
            {['1', '3', '6'].map((interval) => (
              <React.Fragment key={interval}>
                <ListItem>
                  <Checkbox
                    checked={selectedTimeInterval === interval}
                    onChange={() => handleTimeIntervalChange(interval)}
                  />
                  <ListItemText primary={`${interval} min`} />
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


// Komponent CustomTooltip do wyświetlania informacji o punkcie po najechaniu
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: '#fff', border: '1px solid #ccc', padding: '10px' }}>
          <p>{`Time: ${data.time}`}</p>
          <p>{`Value: ${data.amount}`}</p>
        </div>
      );
    }
    return null;
  };


export default Chart;
