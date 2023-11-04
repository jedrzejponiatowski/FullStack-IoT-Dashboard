import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

const XAXISRANGE = 600000; // 60 sekund (1 minuta)

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

  componentDidUpdate(prevProps) {
    if (
      this.props.sensorData.timestamp !== prevProps.sensorData.timestamp ||
      this.props.sensorData.sensorValue !== prevProps.sensorData.sensorValue
    ) {
      const newData = {
        x: this.props.sensorData.timestamp,
        y: this.props.sensorData.sensorValue
      };

      const currentSeries = this.state.series[0].data;
      const cutoff = this.props.sensorData.timestamp - XAXISRANGE;

      const newSeries = currentSeries.filter((data) => data.x > cutoff);
      newSeries.push(newData);

      this.setState({
        series: [
          {
            data: newSeries
          }
        ]
      });
    }
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={this.state.options.chart.height}
        />
      </div>
    );
  }
}

export default DataChart;
