import { useEffect, useState, useRef } from 'react';

import { Line, getElementAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

import './Graph.css';

function Graph({ times, prices, color }) {
  const chartRef = useRef();

  const data = {
    labels: times,
    datasets: [
      {
        label: '',
        data: prices,
        pointStyle: 'circle',
        pointRadius: 0,
        borderColor: color === 'green' ? '#00a004' : 'red',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        displayColors: false,
        yAlign: 'bottom',
        caretPadding: 10,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        display: false,
      },
      x: {
        display: false,
      },
    },
    elements: {
      point: {
        hoverRadius: 4,
      },
    },
  };

  return (
    <div className='graph-container'>
      <Line
        data={data}
        options={options}
        // elements={elements}
      />
    </div>
  );
}

export default Graph;
