import { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'

import './Graph.css'


function Graph({ times, prices, color }) {

    const data = {
        labels: times,
        datasets: [
            {
                label: '',
                data: prices,
                pointStyle: "circle",
                pointRadius: 0,
                borderColor: color,
            }
        ]
    }

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
                mode: 'index',
                intersect: false,
                displayColors: false,
                yAlign: "bottom",
                caretPadding: 10
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                display: false
            },
            x: {
                display: false
            }
        },
        elements: {
            point: {
                hoverRadius: 4
            }
        }
    };


    return (
        <div className="graph-container">
            <Line
                data={data}
                options={options}
            // elements={elements}
            />
        </div>
    )
}

export default Graph
