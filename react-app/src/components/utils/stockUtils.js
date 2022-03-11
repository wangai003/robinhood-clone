export const fixMarketCap = (marketCap) => {
    if (marketCap < 1000) {
        return marketCap.toFixed(2);
    }
    else if (marketCap < 1000000) {
        return (marketCap / 1000).toFixed(2) + "K";
    }
    else if (marketCap < 1000000000) {
        return (marketCap / 1000000).toFixed(2) + "M";
    }
    else if (marketCap < 1000000000000) {
        return (marketCap / 1000000000).toFixed(2) + "B";
    }
    else if (marketCap > 1000000000000) {
        return (marketCap / 1000000000000).toFixed(2) + "T";
    }
    else return marketCap;
}
