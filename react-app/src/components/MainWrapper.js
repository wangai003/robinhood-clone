import React from 'react';
import { Route } from 'react-router-dom';
import NavBar from './NavBar';

const MainWrapper = props => {
  return (
    <Route {...props}>
      <NavBar />
      {props.children}
    </Route>
  );
};

export default MainWrapper;
