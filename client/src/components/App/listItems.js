// ListItems.js
import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TemperatureIcon from '@mui/icons-material/AcUnit';
import HumidityIcon from '@mui/icons-material/Opacity';
import PressureIcon from '@mui/icons-material/Speed';
import LuminousIcon from '@mui/icons-material/BrightnessMedium';
import ConfigIcon from '@mui/icons-material/Settings';
import ArchiveIcon from '@mui/icons-material/Archive';

const ListItems = ({ handleTabChange }) => {
  const items = [
    { icon: <TemperatureIcon />, primary: 'Temperature' },
    { icon: <HumidityIcon />, primary: 'Humidity' },
    { icon: <PressureIcon />, primary: 'Pressure' },
    { icon: <LuminousIcon />, primary: 'Luminous' },
    { icon: <ConfigIcon />, primary: 'Config' },
    { icon: <ArchiveIcon />, primary: 'Archive' },
  ];

  return (
    <React.Fragment>
      {items.map((item) => (
        <ListItemButton
          key={item.primary}
          onClick={() => handleTabChange(item.primary)}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.primary} />
        </ListItemButton>
      ))}
    </React.Fragment>
  );
};

export default ListItems;
