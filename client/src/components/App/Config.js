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

const Config = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeMeasurements, setActiveMeasurements] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [devices, setDevices] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedMeasurementId, setSelectedMeasurementId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
      await axios.delete(`/api/active_measurements/${measurementId}`);

      const response = await axios.get('/api/active_measurements');
      setActiveMeasurements(response.data.data);

      console.log('Measurement deleted successfully');
    } catch (error) {
      console.error('Error deleting measurement:', error);
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
      <Box sx={{ bgcolor: 'white', p: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Active Measurements" />
          <Tab label="Manage Resources" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <React.Fragment>
              <Grid container spacing={4}>
                <Grid item xs={8}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 550 }}>
                    <Typography variant="h6" gutterBottom>
                      List of Active Devices
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Device MAC</TableCell>
                          <TableCell>Channel Type</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activeMeasurements.map((measurement) => (
                          <TableRow key={measurement._id}>
                            <TableCell>{measurement.device.MAC}</TableCell>
                            <TableCell>{measurement.channel.type}</TableCell>
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
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 550 }}>
                    <Box sx={{ bgcolor: 'white', p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Add/Delete Measurement
                      </Typography>
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
                              {device.MAC}
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
                          alignItems: 'flex-end',
                        }}
                      >
                        <Button variant="contained" color="primary" onClick={handleAddMeasurement}>
                          Add
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteMeasurement(selectedMeasurementId)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
          {/* ... (inne zakładki) */}
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default Config;
