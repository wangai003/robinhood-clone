export const unixifyDates = dates => {
    const unixDates = [];
    dates.forEach(date => {
        let unixDate = Date.parse(date) / 1000;
        unixDates.push(unixDate.toString());
    });
    return unixDates;
};

export const getInterval = (interval) => {
    let today = new Date();
    today.setHours(16);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    const open = new Date(today - 23400000);
    const oneDay = 86400000;
    const oneWeekAgo = new Date(today - oneDay * 7);
    const oneMonthAgo = new Date(today - oneDay * 30);
    const threeMonthsAgo = new Date(today - oneDay * 90);
    const oneYearAgo = new Date(today - oneDay * 365);
    // const fiveYearsAgo = new Date(today - oneDay * 365 * 5 - oneDay);

    switch (interval) {
        case '1D':
            return unixifyDates([open, today]);
        case '1W':
            return unixifyDates([oneWeekAgo, today]);
        case '1M':
            return unixifyDates([oneMonthAgo, today]);
        case '3M':
            return unixifyDates([threeMonthsAgo, today]);
        case '1Y':
            return unixifyDates([oneYearAgo, today]);
        // case ('5Y'):
        //     return unixifyDates([fiveYearsAgo, today]);
        default:
            return ['', ''];
    }
};

export const convertTimes = (time, interval) => {
    const date = new Date(time * 1000);
    const year = date.getFullYear();
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
    const day = date.getDate();
    const hours = date.getHours() > 12 ? `${date.getHours() - 12}` : `${date.getHours()}`;
    const minutes = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
    const amPM = date.getHours() > 12 ? 'PM' : 'AM';

    switch (interval) {
        case '1D': {
            return `${hours}:${minutes} ${amPM}`;
        }
        case '1W': {
            return `${month} ${day} ${hours}:${minutes} ${amPM}`;
        }
        case '1M': {
            return `${month} ${day} ${hours}:${minutes} ${amPM}`;
        }
        case '3M':
            return `${month} ${day}, ${year}`;
        case '1Y':
            return `${month} ${day}, ${year}`;
        // case ('5Y'):
        //     return `${month} ${day}, ${year}`;
        default:
            return '';
    }
};

export const handleClick = (int, { setInterval, setIntervalLong, setResolution }) => {
    switch (int) {
        case '1D':
            setIntervalLong('Today');
            setResolution('5');
            // console.log("***************** 1")
            break;
        case '1W':
            setIntervalLong('Past Week');
            setResolution('30');
            // console.log("***************** 2")
            break;
        case '1M':
            setIntervalLong('Past Month');
            setResolution('60');
            // console.log("***************** 3")
            break;
        case '3M':
            setIntervalLong('Past 3 Months');
            setResolution('D');
            // console.log("***************** 4")
            break;
        case '1Y':
            setIntervalLong('Past Year');
            setResolution('D');
            // console.log("***************** 5")
            break;
        // case ('5Y'):
        //     setResolution("W");
        //     break;
        default:
            break;
    }
    setInterval(int);
};
