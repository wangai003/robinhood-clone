import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navbar.css';

const NavBar = ({ user }) => {
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
        <div className='auth'>
          {user ? (
            <ProfileButton />
          ) : (
            <>
              <Link to='/login' exact={true} activeClassName='active'>
                Login
              </Link>
              <Link to='/signup' exact={true} activeClassName='active'>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
