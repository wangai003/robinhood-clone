import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteStockFromWatchlist, deleteWatchlistReducer } from '../../store/portfolio/watchlist';
import AddStockForm from '../AddStockForm';
import CreateWatchlistForm from '../CreateWatchlistform';
import EditWatchlistForm from '../EditWatchlistForm';
import './Watchlist.css';

function Watchlist({ watchlist }) {
  console.log('HIT WATCHLIST');
  const dispatch = useDispatch();
  // const sessionUser = useSelector(state => state.session.User);
  // const watchlists = useSelector(state => state.portfolio.watchlists);
  const [showEditWatchlistForm, changeEditWatchlistForm] = useState(false);
  const [showAddStockToWatchlist, setShowAddStockToWatchlist] = useState(false);
  const toggleEditWatchlistForm = async e => {
    changeEditWatchlistForm(!showEditWatchlistForm);
  };
  const toggleShowAddStockToWatchlist = async e => {
    setShowAddStockToWatchlist(!showAddStockToWatchlist);
  };
  const deleteWatchlist = async e => {
    let response = await dispatch(deleteWatchlistReducer(watchlist.id));
  };

  let editForm;
  let addStockForm;
  if (showEditWatchlistForm) {
    editForm = (
      <EditWatchlistForm
        hideform={toggleEditWatchlistForm}
        watchlist={watchlist}
      ></EditWatchlistForm>
    );
  }
  if (showAddStockToWatchlist) {
    addStockForm = (
      <AddStockForm hideform={toggleShowAddStockToWatchlist} watchlist={watchlist}></AddStockForm>
    );
  }
  return (
    <div className='watchListContainer'>
      <ul className='watchList'>
        {watchlist.name}
        <button onClick={toggleShowAddStockToWatchlist}>Add Stock to Watchlist</button>
        {addStockForm}
        <button onClick={toggleEditWatchlistForm}>Edit name of watchlist</button>
        {editForm}
        <button onClick={deleteWatchlist}>Delete watchlist</button>
        <ul>
          {watchlist &&
            Object.values(watchlist.stocks).map((stock, i) => (
              <div className='watchListStockContainer' key={i}>
                <div>{stock.name}</div>
                <div>{stock.symbol}</div>
                <button
                  onClick={async () =>
                    await dispatch(deleteStockFromWatchlist(stock.id, watchlist))
                  }
                >
                  Delete {stock.name}
                </button>
              </div>
            ))}
        </ul>
      </ul>
    </div>
  );
}

export default Watchlist;
