import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import FilterArchive from './FilterArchive';

const Archive = () => {
  const [measurements, setMeasurements] = useState([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  const [filters, setFilters] = useState({
    temperature: false,
    humidity: false,
    pressure: false,
  });

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get('/api/measurements');
        const measurementsData = response.data.data;

        setMeasurements(measurementsData);
        setFilteredMeasurements(measurementsData);
        console.log('log');
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

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilters({
      ...filters,
      [name]: checked,
    });
  };

  useEffect(() => {
    const filteredData = measurements.filter((measurement) => {
      if (filters.temperature && measurement.channel.type === 'Temperature') {
        return true;
      }
      if (filters.humidity && measurement.channel.type === 'Humidity') {
        return true;
      }
      if (filters.pressure && measurement.channel.type === 'Pressure') {
        return true;
      }
      return false;
    });

    setFilteredMeasurements(filteredData);
  }, [filters, measurements]);

  return (
    <Box sx={{ display: 'flex', gap: 2}}>
      {/* Wyniki w tabelce po lewej stronie */}
      <Paper sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 500,
                    width: '%',
                  }}>
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
            {filteredMeasurements.map((measurement) => (
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
      <Paper >
      {/* Filtry po prawej stronie */}
      <FilterArchive filters={filters} onChange={handleFilterChange} />
      </Paper>
    </Box>
  );
};

export default Archive;
