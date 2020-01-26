import React, { Component } from 'react';
import Chart from 'chart.js';

import { BLUE_PRIMARY, RED_PRIMARY } from "../../../constants/palette.js";

class Bar extends Component {

  componentDidMount = () => {
      var ctx = document.getElementById(this.props.chartId).getContext("2d");

      const { yesCount, noCount } = this.props;
      const maximumValue = yesCount > noCount ? yesCount : noCount;
      const maximumRange = ( maximumValue * 0.20 ) + maximumValue;

      console.log(yesCount, noCount);

      var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        responsive: true,
        data: {
          labels: ['Yes','No' ],
          datasets: [{
            data: [ yesCount, noCount ],
            borderColor: [ BLUE_PRIMARY, RED_PRIMARY ],
            borderWidth: 2,
            fill: true
          }]
        },
        options: {
          legend: { display: false },
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: "Wei (ETH)"
              },
              ticks: {
                suggestedMin: 0,
                max: maximumRange,
                callback: function(label, index, labels) {
                  if(label > 1e8 || label < (-1 * 1e8)){
                     return label.toExponential()
                  } else return label;
                }
              }
            }]
          },
        }
     });
   }

 render() {
   return(
      <div class="chart-area">
        <canvas id={this.props.chartId}> </canvas>
      </div>
    );
  }
}

export default Bar;
