import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { buyAssets, tradeAssets, sellAllAssets } from '../../store/portfolio/assets';
import { addBuyingPower, subtractBuyingPower } from '../../store/portfolio/buyingPower';
import './BuySellStock.css';

function BuySellStockForm({ symbol, buySell, hideForm, stock }) {
    const [count, setCount] = useState(0);
    const [cost, setCost] = useState(0);
    const [errors, setErrors] = useState([]);
    const assets = useSelector(state => state.portfolio.assets)
    const bp = useSelector(state => state.portfolio.buying_power);
    const [asset, setAsset] = useState(Object.entries(assets).find(asset => asset[1].symbol === symbol)?.[1])

    const dispatch = useDispatch();

    const validateSale = () => {
        const errors = [];
        const cost = count * stock.current;
        if (asset && count > asset.count && buySell === 'sell') {
            errors.push("You don't have that many shares to sell");
        }
        if (cost > bp && buySell === 'buy') {
            errors.push("You don't have enough buying power");
        }
        setErrors(errors);
    };

    const manageBuyingPower = async (buySell, price) => {
        if (buySell === 'sell') return await dispatch(addBuyingPower(price));
        else if (buySell === 'buy') return await dispatch(subtractBuyingPower(price));
    }

    useEffect(() => {
        setCost((count * stock.current).toFixed(2));
        validateSale();
        setAsset(Object.entries(assets).find(asset => asset[1].symbol === symbol)?.[1])
    }, [count]);

    useEffect(() => {
        validateSale();
        setAsset(Object.entries(assets).find(asset => asset[1].symbol === symbol)?.[1])
    }, [buySell]);

    const handleChangeBuy = value => {
        if (value < 1) {
            setCount(1);
        } else if (value * stock.current > bp) {
            setCount(Math.floor(bp / stock.current))
        } else setCount(value);
    };

    const handleChangeSell = value => {
        if (value < 1) {
            setCount(1);
        } else if (asset && value > asset.count) {
            setCount(asset.count);
        } else setCount(value);
    };

    const handleSubmit = async (e, buySell) => {
        e.preventDefault();
        if (!errors.length && count > 0) {
            const payload = {
                name: symbol,
                symbol,
                count,
            };
            const price = count * stock.current;
            const fundsError = [];
            if (buySell === 'sell') {
                payload.count = -payload.count;
            }
            if (asset) {
                if (asset.count === count && buySell === 'sell') {
                    await dispatch(sellAllAssets(payload, asset.id));
                    await dispatch(addBuyingPower(price))
                } else {
                    await manageBuyingPower(buySell, price);
                    await dispatch(tradeAssets(payload, asset.id));
                }
            } else {
                await dispatch(subtractBuyingPower(price));
                await dispatch(buyAssets(payload));
            }
        }
        setCount(0);
    };

    return (
        <div className='buy-sell-stock-form-container'>
            {errors.map(error => (
                <div className='buy-sell-errors' key={error}>{error}</div>
            ))}
            {buySell === 'buy' && <div>{`Buy ${count} shares for ${Number(cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</div>}
            {buySell === 'buy' && (
                <form className='buy-sell-form' onSubmit={e => handleSubmit(e, 'buy')}>
                    <input
                        type='number'
                        value={count}
                        onChange={e => handleChangeBuy(e.target.value)}
                    ></input>
                    <div className='buy-sell-btn-container'>
                        <button id="buy-btn" className='buy-sell-btn btn-filled'>Confirm Purchase</button>
                        <button id="cancel-btn" className='buy-sell-btn btn-filled' onClick={hideForm}>Cancel</button>
                    </div>
                </form>
            )}
            {buySell === 'sell' && asset && <div>{`Sell ${count} shares for ${Number(cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</div>}
            {buySell === 'sell' && asset && (
                <form className='buy-sell-form' onSubmit={e => handleSubmit(e, 'sell')}>
                    <input type='number' value={count} onChange={e => handleChangeSell(e.target.value)} />
                    <div className='buy-sell-btn-container'>
                        <button id="buy-btn" className='buy-sell-btn btn-filled'>Confirm Sale</button>
                        <button id="cancel-btn" className='buy-sell-btn btn-filled' onClick={hideForm}>Cancel</button>
                    </div>
                </form>
            )}
            {/* <button onClick={hideForm}>Cancel</button> */}
        </div>
    );
}

export default BuySellStockForm;
