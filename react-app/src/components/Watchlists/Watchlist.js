import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteStockFromWatchlist, deleteWatchlistReducer } from '../../store/portfolio/watchlist';
import AddStockForm from '../AddStockForm';
import EditWatchlistForm from '../EditWatchlistForm';
import WatchlistMenu from './watchlistMenu';
// import Hamburger from 'hamburger-react';
import './Watchlist.css';

function Watchlist({ watchlist, quotes }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showAddStockToWatchlist, setShowAddStockToWatchlist] = useState(false);
  const [editWatchlistText, setEditWatchlistText] = useState('Edit');
  const [isOpen, setOpen] = useState(false);
  const [menuText, setMenuText] = useState('+');
  const toggleIsOpen = e => {
    setOpen(!isOpen);
    if (isOpen) setMenuText('+');
    else {
      setMenuText('-');
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMenuText('+');
      return;
    }
    const closeMenu = () => {
      setOpen(false);
    };

    setMenuText('-');
    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [isOpen]);

  const toggleShowModal = async e => {
    setShowModal(true);
  };
  const toggleShowAddStockToWatchlist = async e => {
    setShowAddStockToWatchlist(!showAddStockToWatchlist);
  };

  let editForm;
  let addStockForm;
  if (showModal) {
    editForm = (
      <EditWatchlistForm
        watchlist={watchlist}
        showModal={showModal}
        setShowModal={setShowModal}
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
        {/* <button onClick={toggleShowAddStockToWatchlist}>Add Stock to Watchlist</button>
        {addStockForm} */}
        {/* <button className='editWatchlist' onClick={toggleShowModal}>{editWatchlistText}</button>
        {editForm} */}
        {/* <div className='hamburgerDiv' onClick={toggleIsOpen}>
        <Hamburger className={"stopit"}size={12} toggled={isOpen} >
             </Hamburger>
             </div> */}
        <div className='nameAndMenuIcon stockSymbol'>
          <span id='watchlistNameMain'> {watchlist.name} </span>
          <span className={'menuSpan'} onClick={e => toggleIsOpen(e)}>
            {' '}
            {menuText}
            {isOpen && <WatchlistMenu watchlist={watchlist}></WatchlistMenu>}
          </span>
        </div>
        {watchlist &&
          Object.values(watchlist.stocks).map((stock, i) => (
            <div key={i} className={'outerDiv'}>
              <Link to={`stocks/${stock.symbol}`}>
                <div className='watchlistStockContainer' key={i}>
                  <div className='leftSide'>
                    <span className='stockSymbol one'>{stock.symbol}</span>
                    <span
                      className='removeStockFromList stockSymbol'
                      onClick={async e => {
                        e.stopPropagation();
                        e.preventDefault();
                        await dispatch(deleteStockFromWatchlist(stock.id, watchlist));
                      }}
                    >
                      Remove {stock.name}
                    </span>
                  </div>
                  <div className='rightSide'>
                    <span className='stockPrice'>
                      {quotes[stock.symbol]?.current.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </span>
                    <span className='stockChange'>{quotes[stock.symbol]?.change}%</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </ul>
    </div>
  );
}

export default Watchlist;
