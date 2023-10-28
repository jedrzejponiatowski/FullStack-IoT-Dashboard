import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class DataBar extends Component {
  constructor(props) {
    super(props);

    // Sprawdź, czy sensorConfig.name istnieje, jeśli nie, ustaw na "NA"
    const name = this.props.sensorConfig.name ? this.props.sensorConfig.name : "NA";

    this.state = {
      options: {
        chart: {
          type: 'bar',
          height: 150
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            horizontal: true,
            dataLabels: {
              max: 50 // Ograniczenie wartości na osi poziomej do 50
            }
          }
        },
        dataLabels: {
          enabled: true
        },
        xaxis: {
          categories: [name],
          max: 50,
          min: 0
        },
      },
      series: [{
        // Sprawdź, czy sensorData.sensorValue istnieje, jeśli nie, ustaw na 0
        data: [this.props.sensorData.sensorValue ? this.props.sensorData.sensorValue : 0]
      }]
    };
  }

  componentDidUpdate(prevProps) {
    // Sprawdź, czy przekazano nową wartość i czy dane są dostępne
    if (this.props.sensorData && prevProps.sensorData.sensorValue !== this.props.sensorData.sensorValue) {
      // Zaktualizuj stan i wykres
      this.setState({
        series: [{
          data: [this.props.sensorData.sensorValue ? this.props.sensorData.sensorValue : 0]
        }]
      });
    }
  }

  render() {
    //console.log("val: ", this.props.sensorData.sensorValue);
    return (
      <Chart options={this.state.options} series={this.state.series} type="bar" height={this.state.options.chart.height} />
    );
  }
}

export default DataBar;
