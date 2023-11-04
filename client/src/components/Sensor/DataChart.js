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
    const newData = {
      x: sensorData.timestamp,
      y: sensorData.sensorValue
    };

    setSeries((prevSeries) => {
      const currentSeries = prevSeries[0].data;
      const cutoff = sensorData.timestamp - XAXISRANGE;

      const newSeries = currentSeries.filter((data) => data.x > cutoff);
      newSeries.push(newData);

      return [
        {
          data: newSeries
        }
      ];
    });
  }, [sensorData]);
  
  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default DataChart;
