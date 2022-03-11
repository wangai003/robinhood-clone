import { handleClick } from '../utils/graphUtils';

function GraphBar({ color, interval, setFunctions }) {
    return (
        <nav className='interval-bar'>
            <button
                className={
                    interval === '1D' ? `interval-btn selected ${color}` : `interval-btn ${color}`
                }
                onClick={e => handleClick(e.target.innerHTML, setFunctions)}
            >
                1D
            </button>
            <button
                className={
                    interval === '1W' ? `interval-btn selected ${color}` : `interval-btn ${color}`
                }
                onClick={e => handleClick(e.target.innerHTML, setFunctions)}
            >
                1W
            </button>
            <button
                className={
                    interval === '1M' ? `interval-btn selected ${color}` : `interval-btn ${color}`
                }
                onClick={e => handleClick(e.target.innerHTML, setFunctions)}
            >
                1M
            </button>
            <button
                className={
                    interval === '3M' ? `interval-btn selected ${color}` : `interval-btn ${color}`
                }
                onClick={e => handleClick(e.target.innerHTML, setFunctions)}
            >
                3M
            </button>
            <button
                className={
                    interval === '1Y' ? `interval-btn selected ${color}` : `interval-btn ${color}`
                }
                onClick={e => handleClick(e.target.innerHTML, setFunctions)}
            >
                1Y
            </button>
            {/* <button
                        className={interval === '5Y' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
                        onClick={(e) => handleClick(e.target.innerHTML, setFunctions)}>
                        5Y
                    </button> */}
        </nav>
    )
}

export default GraphBar;
