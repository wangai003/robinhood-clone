import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navbar.css';

const NavBar = () => {
  return (
    <nav>
      <div className='navbar'>
        <div className='home'>
          <Link to='/' exact={true} activeClassName='active'>
            Home
          </Link>
        </div>
        <div className='searchBar'>
          <input placeholder='search' />
        </div>
        <div className='menus'>
          <ProfileButton />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
