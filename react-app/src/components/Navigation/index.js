import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navbar.css';

const NavBar = () => {
  return (
    <nav>
      <div className='navbar'>
        <div className='home'>
          <Link to='/'>Home</Link>
        </div>
        <div className='searchBar'>
          <i className='fa-solid fa-magnifying-glass fa-lg'></i>
          <input placeholder='Search' />
        </div>
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
