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
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Tooltip,
  Line,
} from 'recharts';

const Chart = ({ measurementName }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState({ xAxisData: [], yAxisData: [] });
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
    fetchData(selectedTimeInterval, measurementName);
  }, [,selectedDevices,selectedTimeInterval, measurementName]);
  
  const fetchData = async (interval, measurementName) => {
    try {
        const measurementsResponse = await axios.get('/api/measurements');
        const measurementsData = measurementsResponse.data.data;
  
        const currentTimestamp = new Date().getTime();
        const intervalMilliseconds = parseInt(interval) * 60 * 1000;
        const startTime = new Date(currentTimestamp - intervalMilliseconds).toISOString();
  
        const filteredMeasurementsData = measurementsData.filter(
          (measurement) => measurement.channel.type === measurementName
            && new Date(measurement.timestamp).getTime() >= new Date(startTime).getTime()
        );
  
        if (filteredMeasurementsData.length === 0) {
          const placeholderMeasurement = {
            device: { MAC: 'undefined' },
            value: 0,
            timestamp: new Date().toISOString(),
          };
          filteredMeasurementsData.push(placeholderMeasurement);
        }
  
        const uniqueDevices = [...new Set(filteredMeasurementsData.map((measurement) => measurement.device.MAC))];
        setUniqueDevices(uniqueDevices.slice(0, 4));
  
        if (selectedDevices.length === 0) {
          setSelectedDevices(uniqueDevices.slice(0, 4));
        }
  
        const uniqueTimestamps = Array.from(new Set(filteredMeasurementsData.map((measurement) => measurement.timestamp)));

        // Przygotowywanie danych dla wykresu
        const xAxisData = uniqueTimestamps.map((timestamp) => formatDate(timestamp));
      console.log(xAxisData);

      const yAxisData = uniqueDevices.map((deviceMAC, index) => {
        const deviceMeasurements = filteredMeasurementsData
          .filter((measurement) => measurement.device.MAC === deviceMAC);

        return {
          deviceMAC,
          data: deviceMeasurements.map((measurement) => (
            measurement.value !== -99 ? measurement.value : null
          )),
          color: chartColors[index],
        };
      });
      console.log(yAxisData[0]);

      setChartData({ xAxisData, yAxisData });
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
    setCurrentAxisInterval(Number(interval));
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
            <LineChart
              data={chartData.xAxisData.map((time, i) => ({
                time,
                ...chartData.yAxisData.reduce((acc, device) => ({
                  ...acc,
                  [device.deviceMAC]: device.data[i],
                }), {}),
              }))}
              margin={{ top: 20, right: 10, bottom: 10, left: 0 }}
            >
              <CartesianGrid stroke="#bbb" strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="time" stroke={theme.palette.text.secondary} tick={{ fontSize: 16 }} interval={currentAxisInterval} />
              <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 16 }} tickCount={10} domain={[0, 40]} />
              <Legend verticalAlign="top" height={36} />
              <Tooltip content={<CustomTooltip />} />

              {chartData.yAxisData.map((device, index) => (
                <Line
                  key={device.deviceMAC}
                  type="monotone"
                  dataKey={device.deviceMAC}
                  name={device.deviceMAC}
                  stroke={device.color}
                  strokeWidth={2}
                  dot={{ strokeWidth: 2, r: 2 }}
                  connectNulls={false}
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
            {['3', '5', '10'].map((interval) => (
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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ background: '#fff', border: '1px solid #ccc', padding: '10px' }}>
        <p>{`Time: ${data.time}`}</p>
        {Object.entries(data)
          .filter(([key, value]) => key !== 'time' && value !== null)
          .map(([key, value]) => (
            <p key={key}>{`${key}: ${value}`}</p>
          ))}
      </div>
    );
  }
  return null;
};

export default Chart;
