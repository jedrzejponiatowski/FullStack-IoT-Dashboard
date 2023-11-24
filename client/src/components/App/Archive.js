import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Checkbox,
    ListItemText,
    Divider,
    Paper,
    Grid,
    Typography,
    CssBaseline,
    Button,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';

const Archive = ({ }) => {
    const [selectedChannel, setSelectedChannel] = useState("default");
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [uniqueDevices, setUniqueDevices] = useState([]);
    const [uniqueChannels, setUniqueChannels] = useState([]);
    const [activeMeasurementsData, setActiveMeasurementsData] = useState([]);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [readyToPlot, setReadyToPlot] = useState(false);
    const [filteredMeasurements, setFilteredMeasurements] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(30);

    useEffect(() => {
        fetchData(startTime, endTime, readyToPlot);
    }, [selectedDevices]);

    const fetchData = async (_startTime, _endTime, readyToPlot) => {
        try {
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

                const measurementsResponse = await axios.get('/api/measurements/filtered', {
                    params: {
                        channel: String(selectedChannel),
                        startTime: Number(startTime),
                        endTime: Number(endTime),
                    },
                });

                const measurementsData = measurementsResponse.data.data;
                const filteredMeasurementsData = measurementsData.filter(
                    (measurement) => {
                        const activeMeasurementExists = activeMeasurementsData.some(
                            (activeMeasurement) =>
                                activeMeasurement.device.MAC === measurement.device.MAC
                        );

                        const isDeviceSelected = selectedDevices.includes(measurement.device.MAC);

                        return (
                            measurement.channel.type === String(selectedChannel) &&
                            new Date(measurement.timestamp).getTime() >= new Date(startTime).getTime() &&
                            activeMeasurementExists &&
                            isDeviceSelected
                        );
                    }
                );
                setFilteredMeasurements(filteredMeasurementsData);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { hour: 'numeric', minute: 'numeric', hour12: false };
        return date.toLocaleTimeString('en-US', options);
    };

    const handleChannelChange = (selectedChannel) => {
        setReadyToPlot(false);
        setSelectedDevices([]);
        setSelectedChannel(selectedChannel);

        if (selectedChannel !== "default") {
            const devicesForSelectedChannel = activeMeasurementsData
                .filter(activeMeasurement => activeMeasurement.channel.type === selectedChannel[0])
                .map(activeMeasurement => activeMeasurement.device.MAC);
            setUniqueDevices(devicesForSelectedChannel);
        } else {
            setUniqueDevices([]);
        }
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
    };

    const handleSave = async () => {
        try {
            // Check if start time is less than end time
            if (startTime >= endTime) {
                throw new Error('Start time must be earlier than end time');
            }

            setReadyToPlot(true);
            await fetchData(startTime, endTime, true);
            
        } catch (error) {
            console.error('Error fetching data:', error.message);
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
                        Archive
                    </Typography>

                    <TableContainer sx={{ marginBottom: 2, maxHeight: '400px' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontFamily: 'serif', fontSize: '16px', borderBottom: '1px solid #808080', borderTop: '1px solid #808080', borderRight: '1px solid #C0C0C0' }}>Channel</TableCell>
                                    <TableCell sx={{ fontFamily: 'serif', fontSize: '16px', borderBottom: '1px solid #808080', borderTop: '1px solid #808080', borderRight: '1px solid #C0C0C0' }}>Device Name</TableCell>
                                    <TableCell sx={{ fontFamily: 'serif', fontSize: '16px', borderBottom: '1px solid #808080', borderTop: '1px solid #808080', borderRight: '1px solid #C0C0C0' }}>Data</TableCell>
                                    <TableCell sx={{ fontFamily: 'serif', fontSize: '16px', borderBottom: '1px solid #808080', borderTop: '1px solid #808080', borderRight: '1px solid #C0C0C0' }}>Value</TableCell>
                                    <TableCell sx={{ fontFamily: 'serif', fontSize: '16px', borderBottom: '1px solid #808080', borderTop: '1px solid #808080'}}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMeasurements
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((measurement, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ borderRight: '1px solid #C0C0C0' }}>{measurement.channel.type}</TableCell>
                                            <TableCell sx={{ borderRight: '1px solid #C0C0C0' }}>{measurement.device.name}</TableCell>
                                            <TableCell sx={{ borderRight: '1px solid #C0C0C0' }}>{formatDate(measurement.timestamp)}</TableCell>
                                            <TableCell sx={{ borderRight: '1px solid #C0C0C0' }}>{measurement.value}</TableCell>
                                            <TableCell>{measurement.status}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination sx={{ marginBottom: 2 }}
                        rowsPerPageOptions={[30, 50, 100]}
                        component="div"
                        count={filteredMeasurements.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

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
                    <Typography variant="h7" gutterBottom component="div" style={{ marginTop: '5px', textAlign: 'center' }}>
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
                            style={{ height: 45 }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200,
                                    },
                                },
                            }}
                        >
                            {uniqueChannels.map((channel) => (
                                <MenuItem key={channel} value={channel}>
                                    <Checkbox checked={selectedChannel.includes(channel)} />
                                    {channel}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    <Typography variant="h7" gutterBottom component="div" style={{ marginTop: '25px', textAlign: 'center' }}>
                        Device List
                    </Typography>
                    <FormControl fullWidth>
                        <Select
                            labelId="device-select-label"
                            id="device-select"
                            multiple
                            value={["Select Devices"]}
                            renderValue={(selected) => (
                                selected.includes("SelectDevice") ? "Select Device" : selected.join(", ")
                            )}
                            style={{ height: 45 }}
                            disabled={selectedChannel === "default"}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200,
                                    },
                                },
                            }}
                        >
                            {uniqueDevices.map((deviceMAC) => {
                                const deviceInfo = activeMeasurementsData.find(device => device.device.MAC === deviceMAC);

                                if (!deviceInfo) {
                                    // Obsłuż przypadki, gdy nie znaleziono informacji o urządzeniu
                                    console.error(`Device information not found for MAC: ${deviceMAC}`);
                                    return null;
                                }

                                return (
                                    <MenuItem key={deviceMAC} value={deviceMAC}>
                                        <Checkbox
                                            checked={selectedDevices.includes(deviceMAC)}
                                            onChange={() => handleCheckboxChange(deviceMAC)}
                                        />
                                        <ListItemText primary={deviceInfo.device.name} />
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h7" gutterBottom component="div" style={{ marginTop: '0px', textAlign: 'center' }}>
                        Date Range
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DateTimePicker
                                label="Start Date"
                                //value={value}
                                onChange={(newValue) => setStartTime(newValue)}
                                style={{ height: '40px' }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DateTimePicker
                                label="End Date"
                                //value={value}
                                onChange={(newValue) => setEndTime(newValue)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleSave} disabled={selectedDevices.length === 0}>
                        Submit
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Archive;
