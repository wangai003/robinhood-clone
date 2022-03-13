import { useRef } from 'react';
import { Line, getElementAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { convertTimes } from '../utils/graphUtils';

import './Graph.css';

function Graph({ times, prices, inverval, color, setActivePrice }) {
  const data = {
    labels: times,
    datasets: [
      {
        label: '',
        data: prices,
        pointStyle: 'circle',
        pointRadius: 0,
        borderColor: color === 'green' ? 'rgb(0, 200, 5)' : 'rgb(255, 80, 0)',
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
      },
      tooltip: {
        usePointStyle: true,
        mode: 'index',
        intersect: false,
        displayColors: false,
        yAlign: 'bottom',
        caretPadding: 100,
        bodyAlign: 'center',
        callbacks: {
          title: () => null,
          label: context => {
            return convertTimes(Number(context.label), inverval);
          },
          labelColor: () => {
            return {
              borderColor: 'white',
              borderWidth: 2,
            };
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

  const tooltipLine = {
    id: 'tooltip-line',
    beforeDraw: chart => {
      if (chart.tooltip._active && chart.tooltip._active.length) {
        const ctx = chart.ctx;
        ctx.save();
        const activePoint = chart.tooltip._active[0];
        setActivePrice(activePoint.element['$context'].raw);
        ctx.beginPath();
        ctx.moveTo(activePoint.element.x, chart.chartArea.top);
        ctx.lineTo(activePoint.element.x, chart.chartArea.bottom);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'grey';
        ctx.stroke();
        ctx.restore();
      } else setActivePrice(null);
    },
  };

  return (
    <div className='graph-container'>
      <Line data={data} options={options} plugins={[tooltipLine]} />
    </div>
  );
}

export default Graph;
