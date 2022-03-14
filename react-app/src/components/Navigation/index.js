import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import SearchBar from './SearchBar';
import './Navbar.css';

const NavBar = () => {
  return (
    <nav>
      <div className='main-navbar'>
        <div className='home'>
          <Link className='logo' to='/'>
            <span className='logoText'>Robinsock</span>
            <img className='logoImg' src='/favicon.ico' alt='' />
          </Link>
        </div>
        <SearchBar />
        <div className='navMenuContainer'>
          <div className='navMenu'>
            <Link to='/'>
              <span>Portfolio</span>
            </Link>
          </div>
          <div className='navMenu'>
            <ProfileButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
