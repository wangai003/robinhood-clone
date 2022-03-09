import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CreateWatchlistForm from '../CreateWatchlistform';
import Watchlist from './Watchlist';
import { loadWatchlists } from '../../store/watchlist';
//probably dont need this since the loading is just done on the main page

function WatchlistList() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.User);
  const watchlists = useSelector(state => state.watchlist.watchlists);
  const [showCreateWatchlistForm, changeCreateWatchlistForm] = useState(false);
  const toggleCreateWatchlistForm = async e => {
    changeCreateWatchlistForm(!showCreateWatchlistForm);
  };

  useEffect(() => {
    dispatch(loadWatchlists());
  }, [dispatch]);

  return (
    <div className='watchlistListContainer'>
      <button onClick={toggleCreateWatchlistForm}>Create new watchlist</button>
      {showCreateWatchlistForm && (
        <CreateWatchlistForm hideform={toggleCreateWatchlistForm}></CreateWatchlistForm>
      )}
      <ul className='watchlists'>
        {watchlists &&
          watchlists.map(watchlist => {
            return <Watchlist key={'watchlist' + watchlist.id} watchlist={watchlist}></Watchlist>;
          })}
      </ul>
    </div>
  );
}

export default WatchlistList;
