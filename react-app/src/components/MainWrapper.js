import React from 'react';
import { Route } from 'react-router-dom';
import NavBar from './Navigation';

const MainWrapper = props => {
  return (
    <main>
      <Route {...props}>
        <NavBar user={props.user} />
        {props.children}
      </Route>
    </main>
  );
};

export default MainWrapper;
