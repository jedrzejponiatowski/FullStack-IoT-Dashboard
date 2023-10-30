import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class DataBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          type: 'bar',
          height: 150,
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            horizontal: true,
            dataLabels: {
              max: 50, // Ograniczenie wartości na osi poziomej do 50
            },
          },
        },
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          categories: ["Temperature 1", "Temperature 2"] , // Ustaw etykiety z props
          max: 50,
          min: 0,
        },
      },
      series: [
        {
          data: [0, 0], // Ustaw dane z props
        },
      ],
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
        series={this.state.series}
        type="bar"
        height={this.state.options.chart.height}
      />
    );
  }
}

export default DataBar;
