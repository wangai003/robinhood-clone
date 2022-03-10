import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Stock from ".";
import { buyAssets, buySellAssets, sellAllAssets } from "../../store/assets";

function BuySellStockForm({ symbol, buySell, hideForm, stock }) {
    const [count, setCount] = useState(1);
    const [cost, setCost] = useState(0);
    const [errors, setErrors] = useState([]);
    const assets = useSelector((state) => state.assets);

    const dispatch = useDispatch();

    const validateSale = () => {
        const errors = []
        if (assets[symbol] && count > assets[symbol].count && buySell === 'sell') {
            errors.push('You don\'t have that many shares to sell');
        }
        setErrors(errors);
    }

    useEffect(() => {
        setCost((count * stock.current).toFixed(2));
        validateSale();
    }, [count])

    useEffect(() => {
        validateSale();
    }, [buySell])

    const handleChangeBuy = (value) => {
        if (value < 1) {
            setCount(1)
        }
        else setCount(value);
    }

    const handleChangeSell = (value) => {
        if (value < 1) {
            setCount(1)
        }
        else if (assets[symbol] && value > assets[symbol].count) {
            setCount(assets[symbol].count);
        }
        else setCount(value);
    }

    const handleSubmit = async (e, buySell) => {
        e.preventDefault()

        if (!errors.length) {
            const payload = {
                name: symbol,
                symbol,
                count
            }
            if (buySell === 'sell') payload.count = -payload.count
            if (assets[symbol]) {
                if (assets[symbol].count === count) {
                    await dispatch(sellAllAssets(payload, assets[symbol].id));
                }
                else {
                    await dispatch(buySellAssets(payload, assets[symbol].id));
                }
            }
            else {
                await dispatch(buyAssets(payload));
            }
        }
        setCount(1);
    }

    return (
        <div>
            {errors.map(error => (
                <div key={error}>{error}</div>
            ))}
            {buySell === 'buy' &&
                <div>{`Buy ${count} shares for $${cost}`}</div>
            }
            {buySell === 'buy' &&
                <form onSubmit={(e) => handleSubmit(e, 'buy')}>
                    <input
                        type="number"
                        value={count}
                        onChange={(e) => handleChangeBuy(e.target.value)}></input>
                    <button>Buy</button>
                </form>
            }
            {buySell === 'sell' && assets[symbol] &&
                <div>{`Sell ${count} shares for $${cost}`}</div>
            }
            {buySell === 'sell' && assets[symbol] &&
                <form onSubmit={(e) => handleSubmit(e, 'sell')}>
                    <input
                        type="number"
                        value={count}
                        onChange={(e) => handleChangeSell(e.target.value)}
                    />
                    <button>Sell</button>
                </form>
            }
            <button onClick={hideForm}>Cancel</button>
        </div>
    )
}

export default BuySellStockForm;
