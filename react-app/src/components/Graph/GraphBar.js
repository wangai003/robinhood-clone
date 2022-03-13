function GraphBar({ color, timeFrame, setTimeFrame, setTimeFrameText }) {
  const handleClick = (timeFrame, setTimeFrame, setTimeFrameText) => {
    switch (timeFrame) {
      case '1D':
        setTimeFrameText('Today');
        break;
      case '1W':
        setTimeFrameText('Past Week');
        break;
      case '1M':
        setTimeFrameText('Past Month');
        break;
      case '3M':
        setTimeFrameText('Past 3 Months');
        break;
      case '1Y':
        setTimeFrameText('Past Year');
      default:
        break;
    }
    setTimeFrame(timeFrame);
  };

  return (
    <nav className='interval-bar'>
      <button
        className={timeFrame === '1D' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
        onClick={e => handleClick(e.target.innerHTML, setTimeFrame, setTimeFrameText)}
      >
        1D
      </button>
      <button
        className={timeFrame === '1W' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
        onClick={e => handleClick(e.target.innerHTML, setTimeFrame, setTimeFrameText)}
      >
        1W
      </button>
      <button
        className={timeFrame === '1M' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
        onClick={e => handleClick(e.target.innerHTML, setTimeFrame, setTimeFrameText)}
      >
        1M
      </button>
      <button
        className={timeFrame === '3M' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
        onClick={e => handleClick(e.target.innerHTML, setTimeFrame, setTimeFrameText)}
      >
        3M
      </button>
      <button
        className={timeFrame === '1Y' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
        onClick={e => handleClick(e.target.innerHTML, setTimeFrame, setTimeFrameText)}
      >
        1Y
      </button>
    </nav>
  );
}

export default GraphBar;
