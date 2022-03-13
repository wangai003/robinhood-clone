import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createWatchlist } from '../../store/portfolio/watchlist';
import { Modal2 } from '../Watchlists/context/Modal';
import './watchlistform.css';
const CreateWatchlistForm = ({ hideform,showModal,setShowModal }) => {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  const updateTitle = e => setTitle(e.target.value);
  const handleSubmit = async e => {
    e.preventDefault();
    const errors = [];
    if (title) {
      const button = document.getElementById('submit');
      const titleInput = document.getElementById('titleInput');

      button.disabled = true;
      titleInput.disabled = true;
      let createdWatchlist = await dispatch(createWatchlist(title, sessionUser.id));
      if (createdWatchlist.error) {
        errors.push(createdWatchlist.error);
        button.disabled = false;
        titleInput.disabled = false;
        setValidationErrors(errors);
      } else {
        // new watch list was created need to rerender or reload
        setShowModal(false)
      }
    }
  };
  let count = 0;
  return (
    <Modal2
    className={"modalWatchlist"}
    title={`Create Watchlist`}
          onClose={() => setShowModal(false)}
          show={showModal}>
      <div>
        <form className='createWatchlistForm' onSubmit={handleSubmit}>
          {validationErrors.length > 0 && (
            <div className='errorsContainer'>
              {validationErrors.map(currError => {
                return <p key={`error-${count++}`}>{currError}</p>;
              })}
            </div>
          )}
          <label className='titleInputLabel'>
            Title
            <input
              type='textarea'
              id='titleInput'
              placeholder='Title'
              value={title}
              onChange={updateTitle}
            />
          </label>
          <input id='submit' type={'submit'}></input>
        </form>
      </div>
    </Modal2>
  );
};

export default CreateWatchlistForm;
