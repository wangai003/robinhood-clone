import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAllStocks } from '../../store/stocks';
import { createWatchlist } from '../../store/portfolio/watchlist';
import './watchlistform.css';
const CreateWatchlistForm = ({ hideform }) => {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  const updateTitle = e => setTitle(e.target.value);
  useEffect(() => {
    const button = document.getElementById('submit');
    if (title === '') {
      button.disabled = true;
      button.style.opacity = 0.4;
    } else {
      button.disabled = false;
      button.style.opacity = 1;
    }
  }, [title]);
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
        console.log('akdjbasjhdbajh');
        errors.push(createdWatchlist.error);
        button.disabled = false;
        titleInput.disabled = false;
        setValidationErrors(errors);
      } else {
        // new watch list was created need to rerender or reload
        hideform();
      }
    }
  };
  let count = 0;
  return (
    <section>
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
    </section>
  );
};

export default CreateWatchlistForm;
