import { useRef } from 'react';

import { Line, getElementAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

import './Graph.css';

function Graph({ times, prices, color, current, setActivePrice }) {
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
        usePointStyle: true,
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
          labelColor: () => {
            return {
              borderColor: 'white',
              borderWidth: 2,
            }
          },
          labelPointStyle: (context) => {
            return {
              pointStyle: 'circle',
              pointRadius: 3
            }
          }
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
        setActivePrice(Number(activePoint.element["$context"].raw).toFixed(2))
        ctx.beginPath();
        ctx.moveTo(activePoint.element.x, chart.chartArea.top);
        ctx.lineTo(activePoint.element.x, chart.chartArea.bottom)
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'grey';
        ctx.stroke();
        ctx.restore();
      }
      else {
        setActivePrice(current)
      }
    }
  }

  return (
    <div className='graph-container'>
      <Line
        data={data}
        options={options}
        plugins={[tooltipLine]}
      />
    </div>
  );
}

export default Graph;
