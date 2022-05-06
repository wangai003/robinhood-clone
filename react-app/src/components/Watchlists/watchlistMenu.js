import EditWatchlistForm from '../EditWatchlistForm';
import React, { useEffect, useState } from 'react';
import { useDispatch,useSelector} from 'react-redux';
import { deleteStockFromWatchlist, deleteWatchlistReducer } from '../../store/portfolio/watchlist';
function WatchlistMenu({watchlist}){
    const [activeEditWatchlist,setActiveEditWatchlist] = useState(null)

    const [showEditModal,setShowEditModal] = useState(false)
    const dispatch = useDispatch();
    const toggleShowEditModal = (e ,watchlist) => {
        // console.log("we re toggling")
        setShowEditModal(true)
        // console.log()
        setActiveEditWatchlist(watchlist)
        // console.log(watchlist)
      }
      const deleteWatchlist = async (e,watchlist) => {
        await dispatch(deleteWatchlistReducer(watchlist.id));
    };
    let editForm;
    if (showEditModal) {
        // console.log("edit form")
        editForm = (
          <EditWatchlistForm
            watchlist={watchlist}
            showModal = {showEditModal}
            setShowModal = {setShowEditModal}
          ></EditWatchlistForm>

        );
      }
    return (
        <div className='watchlistOptions' onClick={e => e.stopPropagation()}>

            <button className='editWatchlist' onClick={(e)=> {
                e.stopPropagation()
                e.preventDefault()
                toggleShowEditModal(e,watchlist)}}>Edit</button>
            <button className='deleteWatchlist testing' onClick={(e) => deleteWatchlist(e,watchlist)}>Delete</button>

            {editForm}

        </div>
      );
}

export default WatchlistMenu
