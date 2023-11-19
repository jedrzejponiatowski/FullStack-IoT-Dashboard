import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Input from '@mui/material/Input';


const Config = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [subTabValue, setSubTabValue] = useState(0);
    const [activeMeasurements, setActiveMeasurements] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [selectedChannel, setSelectedChannel] = useState('');
    const [devices, setDevices] = useState([]);
    const [channels, setChannels] = useState([]);
    const [selectedDeviceName, setSelectedDeviceName] = useState('');
    const [selectedDeviceDescription, setSelectedDeviceDescription] = useState('');
    const [selectedChannelType, setSelectedChannelType] = useState('');
    const [selectedChannelDescription, setSelectedChannelDescription] = useState('');
    const [selectedChannelUnit, setSelectedChannelUnit] = useState('');
    const [selectedChannelFactor, setSelectedChannelFactor] = useState('');

    const handleChannelTypeChange = (event) => {
        setSelectedChannelType(event.target.value);
    };

    const handleChannelDescriptionChange = (event) => {
        setSelectedChannelDescription(event.target.value);
    };

    const handleChannelUnitChange = (event) => {
        setSelectedChannelUnit(event.target.value);
    };

    const handleChannelFactorChange = (event) => {
        setSelectedChannelFactor(event.target.value);
    };

    const handleDeviceNameChange = (event) => {
        setSelectedDeviceName(event.target.value);
    };

    const handleDeviceDescriptionChange = (event) => {
        setSelectedDeviceDescription(event.target.value);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSubTabChange = (event, newValue) => {
        setSubTabValue(newValue);
    };

    const handleDeviceChange = (event) => {
        setSelectedDevice(event.target.value);
    };

    const handleChannelChange = (event) => {
        setSelectedChannel(event.target.value);
    };

    const handleAddMeasurement = async () => {
        try {
            const selectedDeviceId = devices.find(device => device.MAC === selectedDevice)?._id;
            const selectedChannelId = channels.find(channel => channel.type === selectedChannel)?._id;

            if (!selectedDeviceId || !selectedChannelId) {
                console.error('Error fetching device or channel id');
                return;
            }


            // Dodaj nowy pomiar do aktywnych pomiarów
            await axios.post('/api/active_measurements', {
                device: selectedDeviceId,
                channel: selectedChannelId,
            });

            const response = await axios.get('/api/active_measurements');
            setActiveMeasurements(response.data.data);

            setSelectedDevice('');
            setSelectedChannel('');

            console.log('Measurement added successfully');
        } catch (error) {
            console.error('Error adding measurement:', error);
        }
    };

    const handleDeleteMeasurement = async (measurementId) => {
        try {
            //await axios.delete('/api/measurements');
            await axios.delete(`/api/active_measurements/${measurementId}`);

            const response = await axios.get('/api/active_measurements');
            setActiveMeasurements(response.data.data);

            console.log('Measurement deleted successfully');
        } catch (error) {
            console.error('Error deleting measurement:', error);
        }
    };

    const handleAddChannel = async () => {
        try {
            // Assuming you have the API endpoint for adding a channel
            const response = await axios.post('/api/channels', {
                type: selectedChannelType,
                description: selectedChannelDescription,
                unit: selectedChannelUnit,
                factor: selectedChannelFactor,
            });

            // Fetch and update the channels after adding a new one
            const channelsResponse = await axios.get('/api/channels');
            setChannels(channelsResponse.data.data);

            // You might want to clear the input fields after successful addition
            setSelectedChannelType('');
            setSelectedChannelDescription('');
            setSelectedChannelUnit('');
            setSelectedChannelFactor('');

            console.log('Channel added successfully', response.data);
        } catch (error) {
            console.error('Error adding channel:', error);
        }
    };


    const handleAddDevice = async () => {
        try {
            await axios.post('/api/devices', {
                MAC: selectedDevice,
                name: selectedDeviceName,
                description: selectedDeviceDescription,
            });

            const response = await axios.get('/api/devices');
            setDevices(response.data.data);

            setSelectedDevice('');
            setSelectedDeviceName('');
            setSelectedDeviceDescription('');

            console.log('Device added successfully');
        } catch (error) {
            console.error('Error adding device:', error);
        }
    };

    const handleDeleteDevice = async (deviceId) => {
        try {
            // Pobierz aktywne pomiary dla usuwanego urządzenia
            const activeMeasurementsResponse = await axios.get('/api/active_measurements');
            const activeMeasurements = activeMeasurementsResponse.data.data;

            // Znajdź i usuń powiązane pozycje w aktywnych pomiarach
            const measurementsToDelete = activeMeasurements.filter(
                (measurement) => measurement.device._id === deviceId
            );

            // Usuń powiązane aktywne pomiary
            for (const measurementToDelete of measurementsToDelete) {
                await axios.delete(`/api/active_measurements/${measurementToDelete._id}`);
            }

            // Usuń urządzenie
            await axios.delete(`/api/devices/${deviceId}`);

            // Zaktualizuj stan urządzeń po usunięciu
            const deviceResponse = await axios.get('/api/devices');
            setDevices(deviceResponse.data.data);

            // Zaktualizuj aktywne pomiary po usunięciu
            const updatedActiveMeasurementsResponse = await axios.get('/api/active_measurements');
            const updatedActiveMeasurements = updatedActiveMeasurementsResponse.data.data;
            setActiveMeasurements(updatedActiveMeasurements);

            console.log('Device deleted successfully');
        } catch (error) {
            console.error('Error deleting device:', error);
        }
    };

    // Dodaj tę funkcję na początku komponentu Config
    const handleDeleteChannel = async (channelId) => {
        try {
            // Pobierz pomiary dla usuwanego kanału
            const activeMeasurementsResponse = await axios.get('/api/active_measurements');
            const activeMeasurements = activeMeasurementsResponse.data.data;

            // Znajdź i usuń powiązane pozycje w pomiarach
            const measurementsToDelete = activeMeasurements.filter(
                (measurement) => measurement.channel._id === channelId
            );

            // Usuń powiązane aktywne pomiary
            for (const measurementToDelete of measurementsToDelete) {
                await axios.delete(`/api/active_measurements/${measurementToDelete._id}`);
            }

            // Usuń kanał
            await axios.delete(`/api/channels/${channelId}`);

            // Zaktualizuj stan kanałów po usunięciu
            const channelsResponse = await axios.get('/api/channels');
            setChannels(channelsResponse.data.data);

            // Zaktualizuj aktywne pomiary po usunięciu
            const updatedActiveMeasurementsResponse = await axios.get('/api/active_measurements');
            const updatedActiveMeasurements = updatedActiveMeasurementsResponse.data.data;
            setActiveMeasurements(updatedActiveMeasurements);

            console.log('Channel deleted successfully');
        } catch (error) {
            console.error('Error deleting channel:', error);
        }
    };

    useEffect(() => {
        const fetchActiveMeasurements = async () => {
            try {
                const response = await axios.get('/api/active_measurements');
                setActiveMeasurements(response.data.data);
            } catch (error) {
                console.error('Error fetching active measurements:', error);
            }
        };

        const fetchDevices = async () => {
            try {
                const response = await axios.get('/api/devices');
                setDevices(response.data.data);
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };

        const fetchChannels = async () => {
            try {
                const response = await axios.get('/api/channels');
                setChannels(response.data.data);
            } catch (error) {
                console.error('Error fetching channels:', error);
            }
        };

        fetchActiveMeasurements();
        fetchDevices();
        fetchChannels();
    }, []);

    return (
        <React.Fragment>
            <Box sx={{ bgcolor: 'white', p: 3, height: 580 }}>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label="Active Measurements" />
                    <Tab label="Manage Resources" />
                </Tabs>
                <Box sx={{ mt: 2 }}>
                    {activeTab === 0 && (
                        <React.Fragment>
                            <Grid container spacing={4}>
                                <Grid item xs={8}>
                                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 470 }}>
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontFamily: 'serif', fontSize: '16px' }}>Device Name</TableCell>
                                                        <TableCell sx={{ fontFamily: 'serif', fontSize: '16px' }}>Channel Type</TableCell>
                                                        <TableCell sx={{ fontFamily: 'serif', fontSize: '16px' }}>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {activeMeasurements.map((measurement) => (
                                                        <TableRow key={measurement._id}>
                                                            <TableCell>{measurement.device?.name || 'N/A'}</TableCell>
                                                            <TableCell>{measurement.channel?.type || 'N/A'}</TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    onClick={() => handleDeleteMeasurement(measurement._id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 470 }}>
                                        <Typography variant="h6" align='center' fontFamily='serif' gutterBottom style={
                                            { marginTop: '20px', marginBottom: '15px' }}>
                                            Add Active Measurement
                                        </Typography>
                                        <Box sx={{ bgcolor: 'white', p: 3 }}>
                                            <FormControl fullWidth sx={{ mb: 2 }}>
                                                <InputLabel id="device-label">Select Device</InputLabel>
                                                <Select
                                                    labelId="device-label"
                                                    id="device"
                                                    value={selectedDevice}
                                                    onChange={handleDeviceChange}
                                                >
                                                    {devices.map((device) => (
                                                        <MenuItem key={device._id} value={device.MAC}>
                                                            {device.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth sx={{ mb: 2 }}>
                                                <InputLabel id="channel-label">Select Channel</InputLabel>
                                                <Select
                                                    labelId="channel-label"
                                                    id="channel"
                                                    value={selectedChannel}
                                                    onChange={handleChannelChange}
                                                >
                                                    {channels.map((channel) => (
                                                        <MenuItem key={channel._id} value={channel.type}>
                                                            {channel.type}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Button variant="contained" color="primary" onClick={handleAddMeasurement}>
                                                    Add
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    )}
                    {activeTab === 1 && (
                        <React.Fragment>
                            {/* Dodaj subTabs do zakładki "Manage Resources" */}
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Tabs value={subTabValue} onChange={handleSubTabChange}>
                                    <Tab label="Devices" />
                                    <Tab label="Channels" />
                                    {/* Dodaj więcej subTabs, jeśli potrzebujesz */}
                                </Tabs>
                            </Box>

                            {/* Wyświetl odpowiednią treść dla każdego subTaba */}
                            {subTabValue === 0 && (
                                <React.Fragment>
                                    <Grid container spacing={4}>
                                        <Grid item xs={8}>
                                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 413, marginTop: 1 }}>
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell sx={{ fontFamily: 'serif', fontSize: '16px' }}>Device MAC</TableCell>
                                                                <TableCell sx={{ fontFamily: 'serif', fontSize: '16px' }}>Device Name</TableCell>
                                                                <TableCell sx={{ fontFamily: 'serif', fontSize: '16px' }}>Description</TableCell>
                                                                <TableCell sx={{ fontFamily: 'serif', fontSize: '16px' }}>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {devices.map((device) => (
                                                                <TableRow key={device._id}>
                                                                    <TableCell>{device.MAC}</TableCell>
                                                                    <TableCell>{device.name}</TableCell>
                                                                    <TableCell>{device.description}</TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="secondary"
                                                                            onClick={() => handleDeleteDevice(device._id)}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 413, marginTop: 1 }}>
                                                <Typography variant="h6" align='center' fontFamily='serif' gutterBottom style={
                                                    { marginTop: '10px' }}>
                                                    Add Device
                                                </Typography>
                                                <Box sx={{ bgcolor: 'white', p: 3 }}>
                                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                                        <InputLabel id="mac-label">MAC Address</InputLabel>
                                                        <Input
                                                            id="mac"
                                                            value={selectedDevice}
                                                            onChange={handleDeviceChange}
                                                        />
                                                    </FormControl>
                                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                                        <InputLabel id="name-label">Device Name</InputLabel>
                                                        <Input
                                                            id="name"
                                                            value={selectedDeviceName}
                                                            onChange={handleDeviceNameChange}
                                                        />
                                                    </FormControl>
                                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                                        <InputLabel id="description-label">Description</InputLabel>
                                                        <Input
                                                            id="description"
                                                            value={selectedDeviceDescription}
                                                            onChange={handleDeviceDescriptionChange}
                                                        />
                                                    </FormControl>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Button variant="contained" color="primary" onClick={handleAddDevice}>
                                                            Add
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </React.Fragment>
                            )}
                            {subTabValue === 1 && (
                                <React.Fragment>
                                    <Grid container spacing={4}>
                                        {/* Lista kanałów */}
                                        <Grid item xs={8}>
                                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400, marginTop: 1 }}>
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Type</TableCell>
                                                                <TableCell>Description</TableCell>
                                                                <TableCell>Unit</TableCell>
                                                                <TableCell>Factor</TableCell>
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {channels.map((channel) => (
                                                                <TableRow key={channel._id}>
                                                                    <TableCell>{channel.type}</TableCell>
                                                                    <TableCell>{channel.description}</TableCell>
                                                                    <TableCell>{channel.unit}</TableCell>
                                                                    <TableCell>{channel.factor}</TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="secondary"
                                                                            onClick={() => handleDeleteChannel(channel._id)}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>
                                        </Grid>
                                        {/* Opcje do dodawania nowych kanałów */}
                                        <Grid item xs={4}>
                                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400, marginTop: 1 }}>
                                                <Box sx={{ bgcolor: 'white', p: 3 }}>
                                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                                        <InputLabel id="type-label">Type</InputLabel>
                                                        <Input
                                                            id="type"
                                                            value={selectedChannelType}
                                                            onChange={handleChannelTypeChange}
                                                        />
                                                    </FormControl>
                                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                                        <InputLabel id="description-label">Description</InputLabel>
                                                        <Input
                                                            id="description"
                                                            value={selectedChannelDescription}
                                                            onChange={handleChannelDescriptionChange}
                                                        />
                                                    </FormControl>
                                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                                        <InputLabel id="unit-label">Unit</InputLabel>
                                                        <Select
                                                            labelId="unit-label"
                                                            id="unit"
                                                            value={selectedChannelUnit}
                                                            onChange={handleChannelUnitChange}
                                                        >
                                                            {/* Dodaj elementy do listy wybieralnej jednostek */}
                                                            <MenuItem value="Celsius">Celsius</MenuItem>
                                                            <MenuItem value="Percent">Percent</MenuItem>
                                                            {/* Dodaj więcej jednostek, jeśli to konieczne */}
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                                        <InputLabel id="factor-label">Factor</InputLabel>
                                                        <Input
                                                            id="factor"
                                                            value={selectedChannelFactor}
                                                            onChange={handleChannelFactorChange}
                                                        />
                                                    </FormControl>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Button variant="contained" color="primary" onClick={handleAddChannel}>
                                                            Add
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </Box>
            </Box>
        </React.Fragment>
    );

};

export default Config;
