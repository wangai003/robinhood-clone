import { useEffect, useState } from 'react';
import SearchMenu from './SearchMenu';
import './SearchBar.css';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  return (
    <div className='searchBarWrapper'>
      <div
        className={'searchBarContainer' + `${showMenu ? ' focused' : ''}`}
        onClick={e => {
          e.stopPropagation();
          !showMenu && setShowMenu(true);
        }}
      >
        <div className='searchBar'>
          <i className='fa-solid fa-magnifying-glass fa-lg'></i>
          <input
            type='search'
            value={input}
            placeholder='Search'
            onChange={e => setInput(e.target.value)}
          />
        </div>
        {showMenu && <SearchMenu input={input} />}
      </div>
    </div>
  );
};

export default SearchBar;
