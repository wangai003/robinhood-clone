import { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'


function Graph({ symbol, change }) {
    const [prices, setPrices] = useState([]);
    const [times, setTimes] = useState([]);
    const [color, setColor] = useState("green")

    useEffect(() => {
        if (!symbol) {
            return;
        }
        (async () => {
            const response = await fetch(`/api/stocks/${symbol}/candles`);
            const data = await response.json();
            const prices = [];
            const times = [];
            for (const obj of data) {
                const date = new Date(obj.time * 1000);
                // console.log(date.getSeconds())
                const hours = date.getHours()
                const minutes = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
                prices.push(obj.price);
                times.push(`${hours}:${minutes}`);
            }
            setColor(prices[0] < prices[prices.length - 1] ? "green" : "red");
            setTimes(times);
            setPrices(prices);
        })();
    }, [symbol])

    const data = {
        labels: times,
        // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
        datasets: [
            {
                data: prices,
                pointStyle: "line",
                // backgroundColor: "green",
                borderColor: color

            }
        ]
    }

    return (
        <>
            <Line
                data={data}
            />
        </>
    )
}

export default Graph
