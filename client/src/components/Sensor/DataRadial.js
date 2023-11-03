import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class DataRadial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          height: 325,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '50%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              },
            },
          },
        },
        colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
        labels: ["Humidity1", "Humidity2"],
        legend: {
          show: true,
          floating: true,
          fontSize: '16px',
          position: 'left',
          offsetX: -50,
          offsetY: 45,
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
            vertical: 2,
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
      <Chart
        options={this.state.options}
        series={this.props.sensorValues}
        type="radialBar"
        height={this.state.options.chart.height}
      />
    );
  }
}

export default DataRadial;
