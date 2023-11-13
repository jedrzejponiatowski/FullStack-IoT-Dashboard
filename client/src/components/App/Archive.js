import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Link, Typography, Paper } from '@mui/material';

const Archive = () => {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get('/api/measurements');
        const measurementsData = response.data.data;

        setMeasurements(measurementsData);
        console.log("log");
        console.log(response);
      } catch (error) {
        console.error('Error fetching measurements:', error);
      }
    };

    fetchMeasurements();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 500, width: '100%' }}>
      <Typography variant="h6" gutterBottom component="div">
        Measurement Archive
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Channel Type</TableCell>
            <TableCell>Device MAC</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {measurements.map((measurement) => (
            <TableRow key={measurement._id}>
              <TableCell>{measurement.channel && measurement.channel.type}</TableCell>
              <TableCell>{measurement.device && measurement.device.MAC}</TableCell>
              <TableCell>{measurement.value}</TableCell>
              <TableCell>{formatDate(measurement.timestamp)}</TableCell>
              <TableCell>{measurement.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={(e) => e.preventDefault()} sx={{ mt: 3 }}>
        See more measurements
      </Link>
    </Paper>
  );
};

export default Archive;
