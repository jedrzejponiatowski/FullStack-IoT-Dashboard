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
import Divider from '@mui/material/Divider';
import ShowChartIcon from '@mui/icons-material/ShowChart';


const ListItems = ({ handleTabChange }) => {
  const items = [
    { icon: <ShowChartIcon sx={{ color: '#4e342e', fontSize: '30px' }} />, primary: 'Raport' },
    { icon: <ConfigIcon sx={{ color: '#6d4c41', fontSize: '30px' }} />, primary: 'Config' },
    { icon: <ArchiveIcon sx={{ color: '#8d6e63', fontSize: '30px' }} />, primary: 'Archive' },
  ];

  const configAndArchive = [

  ];

  return (
    <React.Fragment>
      {items.map((item) => (
        <ListItemButton key={item.primary} onClick={() => handleTabChange(item.primary)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.primary} />
        </ListItemButton>
      ))}
    </React.Fragment>
  );
};

export default ListItems;