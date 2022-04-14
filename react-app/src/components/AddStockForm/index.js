import { useState } from 'react';
import { useDispatch} from 'react-redux';
import {
  addStockToWatchlist,
  searchStocks,
} from '../../store/portfolio/watchlist';
import { DebounceInput } from 'react-debounce-input';
import './addstockform.css';
const AddStockForm = ({ hideform, watchlist }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const updateName = async e => {
    let str = e.target.value.trim();
    if (str !== '') {
      let res = await dispatch(searchStocks(str));
      let stringList = [];
      for (let stock of res) {
        stringList.push(`${stock.name} ${stock.symbol}`);
      }
      setFilteredStocks(stringList);
    }
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
    setName(e.target.value);
  };
  const updateOnlyName = async str => {
    setName(str);
  };
  const onSuggestion = async e => {
    // console.log('ON UGGESTION');
    e.preventDefault();
    const errors = [];
    setName(e.target.innerText);
    setFilteredStocks([]);
    //for some reason it wont call set name
    let addedStock = await dispatch(addStockToWatchlist(e.target.innerText, watchlist));
    if (addedStock && addedStock.error) {
      errors.push(addedStock.error);
      setValidationErrors(errors);
    } else {
      setActiveSuggestionIndex(0);
      setShowSuggestions(false);
      hideform();
    }
  };

  const onKeyDown = async e => {
    if (e.keyCode === 13) {
      // console.log('IS THIS ENTER');
      if (filteredStocks.length !== 0) {
        setActiveSuggestionIndex(0);
        setShowSuggestions(false);
        // console.log(filteredStocks[activeSuggestionIndex]);
        updateOnlyName(filteredStocks[activeSuggestionIndex]);
        await dispatch(
          addStockToWatchlist(filteredStocks[activeSuggestionIndex], watchlist)
        );
        hideform();
      }
    } else if (e.keyCode === 38) {
      if (activeSuggestionIndex === 0) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    } else if (e.keyCode === 40) {
      if (activeSuggestionIndex - 1 === filteredStocks.length) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    }
  };

  const SuggestionsList = () => {
    return filteredStocks.length ? (
      <ul className='suggestions'>
        {filteredStocks.map((suggestion, index) => {
          let className;
          // Flag the active suggestion with a class
          if (index === activeSuggestionIndex) {
            className = 'suggestion-active';
          }
          return (
            <li className={className} key={index} onClick={onSuggestion}>
              {suggestion}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className='no-suggestions'>
        <em>No suggestions</em>
      </div>
    );
  };

  let count = 0;
  return (
    <section>
      <div>
        {validationErrors.length > 0 && (
          <div className='errorsContainer'>
            {validationErrors.map(currError => {
              return <p key={`error-${count++}`}>{currError}</p>;
            })}
          </div>
        )}
        <label className='name'>
          Name
          <DebounceInput
            placeholder='search here...'
            minLength={2}
            debounceTimeout={500}
            onChange={event => updateName(event)}
            onKeyDown={onKeyDown}
            id={`input${watchlist.id}`}
          />
          {showSuggestions && name && (
            <SuggestionsList
              className='suggestions'
              filteredSuggestions={filteredStocks}
              onSuggestion={onSuggestion}
              activeSuggestionIndex={activeSuggestionIndex}
            />
          )}
        </label>
      </div>
    </section>
  );
};
export default AddStockForm;
