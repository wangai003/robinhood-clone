import React from 'react';
import { Route } from 'react-router-dom';
import NavBar from './Navigation';

const MainWrapper = props => {
  return (
    <main>
      <div className='content'>
        <Route {...props}>
          <NavBar user={props.user} />
          {props.children}
        </Route>
      </div>
    </main>
  );
};

export default MainWrapper;
