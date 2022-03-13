import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editWatchlist } from '../../store/portfolio/watchlist';
import { Modal2 } from '../Watchlists/context/Modal';
import './editwatchlist.css'
const EditWatchlistForm = ({ watchlist ,showModal,setShowModal}) => {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(watchlist.name);
  const [validationErrors, setValidationErrors] = useState([]);

  const updateTitle = e => setTitle(e.target.value);
  useEffect(() => {
    const button = document.getElementById('submitEditWatchlist');
    if (title === '' || title.toLowerCase() === watchlist.name.toLowerCase()) {
      button.disabled = true;
      button.style.opacity = 0.4;
    } else {
      button.disabled = false;
      button.style.opacity = 1;
    }
  }, [title,watchlist.name]);
  const handleSubmit = async e => {
    e.preventDefault();
    const errors = [];
    if (title) {
      const button = document.getElementById('submitEditWatchlist');
      const titleInput = document.getElementById('titleInput');

      button.disabled = true;
      titleInput.disabled = true;
      let editedWatchlist = await dispatch(editWatchlist(title, sessionUser.id, watchlist.id));
      if (editedWatchlist.error) {
        errors.push(editedWatchlist.error);
        button.disabled = false;
        titleInput.disabled = false;
        setValidationErrors(errors);
      } else if (editedWatchlist) {
        // new watch list was created need to rerender or reload
        setShowModal(false)
      }
    }
  };
  let count = 0;
  return (
    <div className='edit-watchlist-container'>
    <Modal2  title={`Change Watchlist name from ${watchlist.name}`}
    onClose={() => setShowModal(false)}
    show={showModal}>
      <div>
        <form className='editWatchlistForm' onSubmit={handleSubmit}>
          <div>
          {validationErrors.length > 0 && (
            <div className='errorsContainer'>
              {validationErrors.map(currError => {
                return <p key={`error-${count++}`}>{currError}</p>;
              })}
            </div>
          )}
</div>
            <input
              type='textarea'
              id='titleInput'
              placeholder='Title'
              value={title}
              onChange={updateTitle}
            />

          <input id='submitEditWatchlist' type={'submit'}></input>
        </form>
      </div>
    </Modal2>
    </div>
  );
};

export default EditWatchlistForm;
