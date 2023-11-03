import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class DataPolarArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
        options: {
          chart: {
            type: 'polarArea',
          },
          stroke: {
            colors: ['#fff'],
          },
          fill: {
            opacity: 0.8,
          },
          yaxis: {
            max: 1300,
          },
          labels: ["Humidity1", "Humidity2"],
          legend: {
            show: true,
            floating: true,
            fontSize: '15px',
            position: 'left',
            offsetX: -30,
            offsetY: -20,
            labels: {
              useSeriesColors: true,
            },
            markers: {
              size: 0,
            },
            formatter: function (seriesName, opts) {
              return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
            },
            itemMargin: {
              vertical: 3,
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  show: false,
                },
              },
            },
          ],
        },
      };
      
  }

  componentDidUpdate(prevProps) {
    // Sprawdź, czy przekazano nową tablicę sensorValues i czy dane są dostępne
        if (
        this.props.sensorValues &&
        prevProps.sensorValues !== this.props.sensorValues  &&
        prevProps
        ) {
            // Zaktualizuj stan i wykres
            this.setState({
                series: [
                {
                    data: this.props.sensorValues,
                },
                ],
            });
        }
    }

  render() {
    return (
    <div id="chart">
    <Chart
        options={this.state.options}
        series={this.props.sensorValues}
        type="polarArea"
    />
    </div>
    );
  }
}

export default DataPolarArea;
