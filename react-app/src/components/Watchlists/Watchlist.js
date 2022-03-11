import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteStockFromWatchlist, deleteWatchlistReducer } from '../../store/portfolio/watchlist';
import AddStockForm from '../AddStockForm';
import EditWatchlistForm from '../EditWatchlistForm';
import './Watchlist.css';

function Watchlist({ watchlist }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showAddStockToWatchlist, setShowAddStockToWatchlist] = useState(false);
  const [editWatchlistText,setEditWatchlistText] = useState("Edit")
  const toggleShowModal = async e => {
    setShowModal(true)
  };
  const toggleShowAddStockToWatchlist = async e => {
    setShowAddStockToWatchlist(!showAddStockToWatchlist);
  };
  const deleteWatchlist = async e => {
      await dispatch(deleteWatchlistReducer(watchlist.id));
  };
  let editForm;
  let addStockForm;
  if (showModal) {
    editForm = (
      <EditWatchlistForm
        watchlist={watchlist}
        showModal = {showModal}
        setShowModal = {setShowModal}
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
        {/* <button onClick={toggleShowAddStockToWatchlist}>Add Stock to Watchlist</button>
        {addStockForm} */}
        <button className='editWatchlist' onClick={toggleShowModal}>{editWatchlistText}</button>
        {editForm}
        <button className='deleteWatchlist' onClick={deleteWatchlist}>Delete</button>
        <ul>
          {watchlist &&
            Object.values(watchlist.stocks).map((stock, i) => (
              <div className='watchListStockContainer' key={i}>

                <Link key={i} to={`stocks/${stock.symbol}`}>
                <span className='stock'>{stock.symbol}
                </span>
                </Link>
                <button
                  onClick={async () =>
                    await dispatch(deleteStockFromWatchlist(stock.id, watchlist))
                  }
                >
                  Remove {stock.name}
                </button>
              </div>
            ))}
        </ul>
      </ul>
    </div>
  );
}

export default Watchlist;
