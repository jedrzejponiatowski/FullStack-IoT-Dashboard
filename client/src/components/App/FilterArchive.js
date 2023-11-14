// FilterArchive.js
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const FilterArchive = ({ filters, onChange }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        marginLeft: 'auto', // Dodano styl, aby przesunąć komponent na prawą stronę
      }}
    >
      <Typography variant="h6">Archive Filters</Typography>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.temperature}
              onChange={onChange}
              name="temperature"
            />
          }
          label="Temperature"
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.humidity}
              onChange={onChange}
              name="humidity"
            />
          }
          label="Humidity"
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.pressure}
              onChange={onChange}
              name="pressure"
            />
          }
          label="Pressure"
        />
      </div>
    </Paper>
  );
};

export default FilterArchive;
