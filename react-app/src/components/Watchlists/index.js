import React, { useState } from 'react';
import { useSelector} from 'react-redux';
import CreateWatchlistForm from '../CreateWatchlistform';
import Watchlist from './Watchlist';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function WatchlistList() {

  const watchlists = Object.values(useSelector(state => state.portfolio.watchlists));
  const [showModal, setShowModal] = useState(false);
  const [showCreateWatchlistForm, changeCreateWatchlistForm] = useState(false);
  const [createWatchlistText, setCreateWatchlistText] = useState('New Watchlist');
  const toggleCreateWatchlistForm = async e => {
    setShowModal(true)
    changeCreateWatchlistForm(!showCreateWatchlistForm);
  };


  return (
    <div className='watchlistListContainer'>
      <div>
         <button className={"createWatchlistButton"} onClick={toggleCreateWatchlistForm}>{createWatchlistText}</button>
      {showModal && (
        <CreateWatchlistForm hideform={toggleCreateWatchlistForm}showModal={showModal} setShowModal={setShowModal}></CreateWatchlistForm>
      )}
      </div>
        <Tabs>
      <TabList>
        {watchlists &&
          watchlists.map(watchlist => {
            return <Tab>
              {watchlist.name}
            </Tab>
          })}
        </TabList>
        {watchlists.map(watchlist => {
          return <TabPanel>
          <Watchlist key={'watchlist' + watchlist.id} watchlist={watchlist}></Watchlist>
          </TabPanel>
        })}
      </Tabs>
    </div>
  );
}

export default WatchlistList;
