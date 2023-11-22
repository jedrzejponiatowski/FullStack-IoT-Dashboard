import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
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
    Button,
} from '@mui/material';
import {
    LineChart,
    XAxis,
    YAxis,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    Tooltip,
    Line
} from 'recharts';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const Chart = ({ measurementName }) => {
    const theme = useTheme();
    const [chartData, setChartData] = useState({ xAxisData: [], yAxisData: [] });
    const [selectedChannel, setSelectedChannel] = useState("default");
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [uniqueDevices, setUniqueDevices] = useState([]);
    const [uniqueChannels, setUniqueChannels] = useState([]);
    const [selectedTimeInterval, setSelectedTimeInterval] = useState('3');
    const [currentAxisInterval, setCurrentAxisInterval] = useState(1);
    const [activeMeasurementsData, setActiveMeasurementsData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [readyToPlot, setReadyToPlot] = useState(false);
    const [chartColors, setChartColors] = useState([
        '#FF5733', // Pomarańczowy
        '#34A853', // Zielony
        '#4285F4', // Niebieski
        '#EA4335', // Czerwony
    ]);

    useEffect(() => {
        fetchData(selectedChannel, startTime, endTime);
        //console.log(selectedDevices);
    }, [selectedDevices]);

    const fetchData = async (channel, _startTime, _endTime) => {
        try {
            console.log("****");
            //console.log(String(channel));
            //console.log(Number(startTime));
            //console.log(Number(endTime));

            const activeMeasurementsResponse = await axios.get('/api/active_measurements');

            const activeMeasurementsData = activeMeasurementsResponse.data.data;
            setActiveMeasurementsData(activeMeasurementsData);

            const uniqueChannels = [...new Set(activeMeasurementsData.map(activeMeasurement => activeMeasurement.channel.type))];
            setUniqueChannels(uniqueChannels);

            if (selectedChannel[0] !== "default") {
                const devicesForSelectedChannel = activeMeasurementsData
                    .filter(activeMeasurement => activeMeasurement.channel.type === selectedChannel[0])
                    .map(activeMeasurement => activeMeasurement.device.MAC);

                setUniqueDevices(devicesForSelectedChannel);
            } else {
                setUniqueDevices([]);
            }

            if (readyToPlot) {
                console.log("aaa");
                const Achannel = 'Temperature';
                const currentTime = new Date().getTime();
                const fiveMinutesAgo = currentTime - 5 * 60 * 1000;
                const AstartTime = new Date(fiveMinutesAgo);
                const AendTime = new Date(currentTime);
                console.log(Number(AstartTime));

                const measurementsResponse = await axios.get('/api/measurements/filtered', {
                    params: {
                        channel: Achannel,
                        startTime: Number(AstartTime),
                        endTime: Number(AendTime),
                    },
                });
                console.log(measurementsResponse);

                const measurementsData = measurementsResponse.data.data;

                const filteredMeasurementsData = measurementsData.filter(
                    (measurement) => {
                        const activeMeasurementExists = activeMeasurementsData.some(
                            (activeMeasurement) =>
                                activeMeasurement.device.MAC === measurement.device.MAC
                        );

                        // Dodaj warunek, aby sprawdzić, czy MAC adres istnieje w selectedDevices
                        const isDeviceSelected = selectedDevices.includes(measurement.device.MAC);

                        return (
                            measurement.channel.type === measurementName &&
                            new Date(measurement.timestamp).getTime() >= new Date(startTime).getTime() &&
                            activeMeasurementExists &&
                            isDeviceSelected
                        );
                    }
                );

                if (filteredMeasurementsData.length === 0) {
                    const placeholderMeasurement = {
                        device: { MAC: 'undefined' },
                        value: 0,
                        timestamp: new Date().toISOString(),
                    };
                    filteredMeasurementsData.push(placeholderMeasurement);
                }

                const uniqueTimestamps = Array.from(new Set(filteredMeasurementsData.map((measurement) => measurement.timestamp)));

                // Przygotowywanie danych dla wykresu
                const xAxisData = uniqueTimestamps.map((timestamp) => formatDate(timestamp));

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

                yAxisData.forEach(deviceData => {
                    const paddingLength = xAxisData.length - deviceData.data.length;
                    deviceData.data = Array(paddingLength).fill(null).concat(deviceData.data);
                });

                setChartData({ xAxisData, yAxisData });
            }
            else {
                setChartData({ xAxisData: [], yAxisData: [] });
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { hour: 'numeric', minute: 'numeric', hour12: false };
        return date.toLocaleTimeString('en-US', options);
    };

    const handleChannelChange = (selectedChannel) => {
        setSelectedChannel(selectedChannel);

        // Aktualizacja listy wybranych urządzeń na podstawie wybranego kanału
        if (selectedChannel !== "default") {
            const devicesForSelectedChannel = activeMeasurementsData
                .filter(activeMeasurement => activeMeasurement.channel.type === selectedChannel[0])
                .map(activeMeasurement => activeMeasurement.device.MAC);
            setUniqueDevices(devicesForSelectedChannel);
        } else {
            // Jeśli wybrany kanał to "default", wyczyść listę wybranych urządzeń
            setUniqueDevices([]);
        }

        //console.log(selectedChannel);
    };

    const handleDeviceChange = (selected) => {
        handleCheckboxChange(selected);

    };

    const handleCheckboxChange = (deviceMAC) => {

        setSelectedDevices((prevSelectedDevices) => {
            if (prevSelectedDevices.includes(deviceMAC)) {
                // Jeśli urządzenie jest już zaznaczone, usuń je z listy
                return prevSelectedDevices.filter((device) => device !== deviceMAC);
            } else {
                // W przeciwnym razie dodaj urządzenie do listy
                return [...prevSelectedDevices, deviceMAC];
            }
        });
        //console.log(selectedDevices);
    };

    const handleSave = async () => {
        try {
            // Check if start time is less than end time
            if (startTime >= endTime) {
                console.error('Start time must be earlier than end time');
                return; // Exit the function if the check fails
            }

            setReadyToPlot(true);
            // Przesunięcie wywołania fetchData do tego miejsca
            await fetchData(selectedChannel, startTime, endTime);
            console.log('Data fetched successfully!');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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
                    <Typography variant="h6" gutterBottom component="div" style={{ marginTop: '16px' }}>
                        Channel List
                    </Typography>
                    <FormControl fullWidth>
                        <Select
                            labelId="channel-select-label"
                            id="channel-select"
                            value={selectedChannel} // Zmiana warunku na "default"
                            onChange={(event) => handleChannelChange([event.target.value])}
                            renderValue={(selected) => (
                                selected === "default" ? "Select Channel" : selected // Zmiana warunku renderValue
                            )}
                            style={{ height: 'auto' }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            }}
                        >

                            {/* Pozostałe opcje */}
                            {uniqueChannels.map((channel) => (
                                <MenuItem key={channel} value={channel}>
                                    <Checkbox checked={selectedChannel.includes(channel)} />
                                    {channel}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    <Typography variant="h6" gutterBottom component="div">
                        Device List
                    </Typography>
                    <FormControl fullWidth>
                        <Select
                            labelId="device-select-label"
                            id="device-select"
                            multiple
                            value={selectedDevices} // Change this line
                            //onChange={(event) => handleDeviceChange([event.target.value])}
                            renderValue={(selected) => (
                                selected.includes("SelectDevice") ? "Select Device" : selected.join(", ")
                            )}
                            style={{ height: 'auto' }}
                            disabled={selectedChannel === "default"}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            }}
                        >
                            {uniqueDevices.map((deviceMAC) => (
                                <MenuItem key={deviceMAC} value={deviceMAC}>
                                    <Checkbox
                                        checked={selectedDevices.includes(deviceMAC)}
                                        onChange={() => handleCheckboxChange(deviceMAC)}
                                    />
                                    <ListItemText primary={deviceMAC} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="h6" gutterBottom component="div" style={{ marginTop: '16px' }}>
                        Date Range
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Controlled picker"
                                //value={pickedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <TimePicker
                                label="Start Time"
                                //value={value}
                                onChange={(newValue) => setStartTime(newValue)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <TimePicker
                                label="End Time"
                                //value={value}
                                onChange={(newValue) => setEndTime(newValue)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <Button variant="contained" color="primary" onClick={handleSave} disabled={selectedDevices.length === 0}>
                        Submit
                    </Button>
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
