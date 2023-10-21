import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

const TICKINTERVAL = 1000; // 1 sekunda
const XAXISRANGE = 60000; // 60 sekund (1 minuta)

class DataChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: []
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
          min: 0,
          max: 10
        },
        legend: {
          show: false
        }
      }
    };
  }

  componentDidMount() {
    const yrange = {
      min: 0,
      max: 10
    };

    const updateData = () => {
      const newDate = new Date().getTime();
      const newData = {
        x: newDate,
        y: Math.random() * (yrange.max - yrange.min) + yrange.min
      };

      const series = this.state.series[0].data;
      const cutoff = newDate - XAXISRANGE;

      const newSeries = series.filter((data) => data.x > cutoff);

      // Dodaj nowe dane
      newSeries.push(newData);

      this.setState({
        series: [
          {
            data: newSeries
          }
        ]
      });
    };

    // Rozpocznij dodawanie danych co sekundę
    updateData();
    this.interval = setInterval(updateData, TICKINTERVAL);
  }

  componentWillUnmount() {
    // Zatrzymaj interwał przed usunięciem komponentu
    clearInterval(this.interval);
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
