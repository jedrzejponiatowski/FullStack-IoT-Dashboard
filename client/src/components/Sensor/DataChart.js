import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

let lastDate = 0;
let data = [];
const TICKINTERVAL = 86400000;
const XAXISRANGE = 777600000;

function getDayWiseTimeSeries(baseval, count, yrange) {
  let i = 0;
  while (i < count) {
    const x = baseval;
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    data.push({ x, y });
    lastDate = baseval;
    baseval += TICKINTERVAL;
    i++;
  }
}

getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
  min: 10,
  max: 90
});

function getNewSeries(baseval, yrange) {
  const newDate = baseval + TICKINTERVAL;
  lastDate = newDate;

  for (let i = 0; i < data.length - 10; i++) {
    data[i].x = newDate - XAXISRANGE - TICKINTERVAL;
    data[i].y = 0;
  }

  data.push({
    x: newDate,
    y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
  });
}

function resetData() {
  data = data.slice(data.length - 10, data.length);
}

class DataChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: data.slice()
        }
      ],
      options: {
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
          max: 100
        },
        legend: {
          show: false
        }
      }
    };
  }

  componentDidMount() {
    window.setInterval(() => {
      getNewSeries(lastDate, {
        min: 10,
        max: 90
      });

      this.setState({
        series: [
          {
            data: data
          }
        ]
      });
    }, 1000);

    window.setInterval(() => {
      resetData();
      this.setState(
        {
          series: [
            {
              data
            }
          ]
        },
        false,
        true
      );
    }, 60000);
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
      </div>
    );
  }
}

export default DataChart;
