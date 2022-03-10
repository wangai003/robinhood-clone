import { useState } from "react";
import { useDispatch } from "react-redux";
import { buyAssets } from "../../store/assets";

function BuyStockForm({ symbol, stock, buyingPower }) {
    const [count, setCount] = useState(1);

    const dispatch = useDispatch();

    const handleChange = (value) => {
        if (value < 1) {
            setCount(1)
        }
        else setCount(value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(stock);
        const payload = {
            name: stock.name,
            symbol,
            count
        }
        const asset = await dispatch(buyAssets(payload));
    }

    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="number"
                    value={count}
                    onChange={(e) => handleChange(e.target.value)}></input>
                <button>Buy</button>
            </form>
        </div>
    )
}

export default BuyStockForm;
