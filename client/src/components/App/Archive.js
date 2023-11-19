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
    CssBaseline,
    FormControlLabel,
    Checkbox,
    Grid,
} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import '@fontsource/roboto/400.css';

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

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Dodaj 1, ponieważ miesiące są indeksowane od 0
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}.${month}.${year}, ${hours}:${minutes}`;
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
            if (filters.luminous && measurement.channel.type === 'Luminous') {
                return true;
            }
            return false;
        });

        setFilteredMeasurements(filteredData);
    }, [filters, measurements]);

    return (
        <>
            <CssBaseline />
            <div style={{ height: '100vh', overflow: 'hidden' }}>
                <Grid container spacing={4} style={{ height: '100%' }}>
                    <Grid item xs={9}>
                        {/* Wyniki w tabelce po lewej stronie */}
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 570,
                                boxShadow: '5px 5px 25px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <Typography variant="h6" align='center' fontFamily='serif' gutterBottom style={{ marginBottom: '15px' }}>
                                Measurement Archive
                            </Typography>
                            <TableContainer marginTop='1'>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily: 'serif', fontSize: '16px', borderBottom: '1px solid #808080', borderTop: '1px solid #808080', borderRight: '1px solid #C0C0C0' }}>Channel Type</TableCell>
                                            <TableCell sx={{ fontFamily: 'serif', fontSize: '16px', borderBottom: '1px solid #808080', borderTop: '1px solid #808080', borderRight: '1px solid #C0C0C0' }}>Device Name</TableCell>
                                            <TableCell sx={{ fontFamily: 'serif', fontSize: '16px', borderBottom: '1px solid #808080', borderTop: '1px solid #808080', borderRight: '1px solid #C0C0C0' }}>Value</TableCell>
                                            <TableCell sx={{ fontFamily: 'serif', fontSize: '16px', borderBottom: '1px solid #808080', borderTop: '1px solid #808080', borderRight: '1px solid #C0C0C0' }}>Date</TableCell>
                                            <TableCell sx={{ fontFamily: 'serif', fontSize: '16px', borderBottom: '1px solid #808080', borderTop: '1px solid #808080', }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredMeasurements.slice().reverse().map((measurement) => (
                                            <TableRow key={measurement._id}>
                                                <TableCell sx={{ borderRight: '1px solid #C0C0C0' }}>{measurement.channel && measurement.channel.type}</TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #C0C0C0' }}>{measurement.device && measurement.device.name}</TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #C0C0C0' }}>{measurement.value}</TableCell>
                                                <TableCell sx={{ borderRight: '1px solid #C0C0C0' }}>{formatDate(measurement.timestamp)}</TableCell>
                                                <TableCell>{measurement.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        {/* Filtry po prawej stronie */}
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 570,
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '5px 5px 25px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <Typography variant="h6" align="center" fontFamily="serif" gutterBottom style={{ marginTop: '-50px', marginBottom: '30px' }}>
                                Archive Filters
                            </Typography>
                            <div style={{ width: '100%', marginBottom: '10px', marginLeft: '50px' }}>
                                <FormControlLabel
                                    control={<Checkbox checked={filters.temperature} onChange={handleFilterChange} name="temperature" />}
                                    label="Temperature"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center' }}
                                />
                            </div>
                            <div style={{ width: '100%', marginBottom: '10px', marginLeft: '50px' }}>
                                <FormControlLabel
                                    control={<Checkbox checked={filters.humidity} onChange={handleFilterChange} name="humidity" />}
                                    label="Humidity"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center' }}
                                />
                            </div>
                            <div style={{ width: '100%', marginBottom: '10px', marginLeft: '50px'}}>
                                <FormControlLabel
                                    control={<Checkbox checked={filters.pressure} onChange={handleFilterChange} name="pressure" />}
                                    label="Pressure"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center' }}
                                />
                            </div>
                            <div style={{ width: '100%' , marginLeft: '50px'}}>
                                <FormControlLabel
                                    control={<Checkbox checked={filters.luminous} onChange={handleFilterChange} name="luminous" />}
                                    label="Luminous"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center' }}
                                />
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default Archive;
