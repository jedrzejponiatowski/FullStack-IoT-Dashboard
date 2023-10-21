import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

//const TICKINTERVAL = 10000; // 1 sekunda
const XAXISRANGE = 600000; // 60 sekund (1 minuta)

const DataChart = ({ sensorData }) => {
  const [series, setSeries] = useState([
    {
      data: []
    }
  ]);

  const options = {
    chart: {
      id: 'realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Dynamic Updating Chart',
      align: 'left'
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime',
      range: XAXISRANGE
    },
    yaxis: {
      min: 0,
      max: 10
    },
    legend: {
      show: false
    }
  };

  useEffect(() => {
    const updateData = () => {
      const newData = {
        x: sensorData.timestamp, // Użyj timestamp z sensorData
        y: sensorData.sensorValue
      };
  
      const currentSeries = series[0].data;
      const cutoff = sensorData.timestamp - XAXISRANGE; // Zmiana newDate na sensorData.timestamp
  
      const newSeries = currentSeries.filter((data) => data.x > cutoff);
      newSeries.push(newData);
  
      setSeries([
        {
          data: newSeries
        }
      ]);
    };
  
    updateData(); // Wywołaj updateData po raz pierwszy
    //const interval = setInterval(updateData, TICKINTERVAL);
  
  }, [sensorData, series]);
  

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default DataChart;
