import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreateWatchlistForm from '../CreateWatchlistform';
import Watchlist from './Watchlist';
import { deleteStockFromWatchlist, deleteWatchlistReducer } from '../../store/portfolio/watchlist';
import 'react-tabs/style/react-tabs.css';
import './Watchlist.css';
import EditWatchlistForm from '../EditWatchlistForm';
// import Hamburger from 'hamburger-react'
import WatchlistMenu from './watchlistMenu';

const WatchlistList = ({ quotes }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateWatchlistForm, changeCreateWatchlistForm] = useState(true);
  const [createWatchlistText, setCreateWatchlistText] = useState('New Watchlist');
  const [activeEditWatchlist, setActiveEditWatchlist] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isOpen, setOpen] = useState(false);

  const watchlists = Object.values(useSelector(state => state.portfolio.watchlists));

  const toggleCreateWatchlistForm = async e => {
    setShowModal(true);
    changeCreateWatchlistForm(!showCreateWatchlistForm);
  };

  const toggleShowEditModal = (e, watchlist) => {
    setShowEditModal(true);
    // console.log();
    setActiveEditWatchlist(watchlist);
    // console.log(watchlist);
  };
  const deleteWatchlist = async (e, watchlist) => {
    await dispatch(deleteWatchlistReducer(watchlist.id));
  };

  const toggleIsOpen = e => {
    setOpen(!isOpen);
  };
  let editForm;
  let menu;
  if (showEditModal) {
    editForm = (
      <EditWatchlistForm
        watchlist={activeEditWatchlist}
        showModal={showEditModal}
        setShowModal={setShowEditModal}
      ></EditWatchlistForm>
    );
  }
  if (isOpen) {
    menu = <WatchlistMenu watchlist={activeEditWatchlist}></WatchlistMenu>;
  }
  return (
    <div className='watchlistListContainer'>
      <div>
        <button className={'createWatchlistButton'} onClick={toggleCreateWatchlistForm}>
          {createWatchlistText}
        </button>
        {showModal && (
          <CreateWatchlistForm
            hideform={toggleCreateWatchlistForm}
            showModal={showModal}
            setShowModal={setShowModal}
          ></CreateWatchlistForm>
        )}
      </div>

      {watchlists &&
        watchlists.map(watchlist => {
          return (
            <div
              key={'watchlist' + watchlist.id}
              className={'notActiveWatchlist watchlist'}
              onClick={event => {
                if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'SPAN') {
                  //target is specific event.target === event.currentTarget ||
                  // console.log('hitting true');
                  if (event.currentTarget.classList.contains('activeWatchlist'))
                    event.currentTarget.classList.remove('activeWatchlist');
                  else {
                    event.currentTarget.classList.add('activeWatchlist');
                  }
                } else {
                  //   console.log("fasle")
                  // console.log(event.target)
                }
              }}
            >
              <div className='flexDiv'>
                {/* <Hamburger size={20} toggled={isOpen} toggle={setOpen}>
             </Hamburger> */}
                {/* all menus are opening rather than just the one clicked */}
                {/* <div className='innerFlexDiv'>
             <span onClick={(e) => toggleIsOpen(e)}> + </span>
             {isOpen &&<WatchlistMenu watchlist={watchlist}></WatchlistMenu>}
             </div> */}
                {/* <button className='editWatchlist' onClick={(e)=> toggleShowEditModal(e,watchlist)}>Edit</button>
            <button className='deleteWatchlist testing' onClick={(e) => deleteWatchlist(e,watchlist)}>Delete</button> */}
                {/* {editForm} */}
                {<Watchlist watchlist={watchlist} quotes={quotes}></Watchlist>}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default WatchlistList;
