export const fixMarketCap = (marketCap) => {
    if (marketCap < 1000) {
        return marketCap.toFixed(2).toString();
    }
    else if (marketCap < 1000000) {
        return (marketCap / 1000).toFixed(2).toString() + "K";
    }
    else if (marketCap < 1000000000) {
        return (marketCap / 1000000).toFixed(2).toString() + "M";
    }
    else if (marketCap < 1000000000000) {
        return (marketCap / 1000000000).toFixed(2).toString() + "B";
    }
    else if (marketCap > 1000000000000) {
        return (marketCap / 1000000000000).toFixed(2).toString() + "T";
    }
    else return marketCap;
}


