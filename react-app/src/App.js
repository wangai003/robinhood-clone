import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Splash from './components/splash';
import Dashboard from './components/dashboard';
import MainWrapper from './components/MainWrapper';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
// import UsersList from './components/UsersList';
// import User from './components/User';
import Stock from './components/Stock';
import { authenticate } from './store/session';
import Watchlist from './components/WatchList';
import { loadWatchlists } from './store/watchlist';
import WatchlistList from './components/WatchlistList';
function App() {
  const user = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      await dispatch(loadWatchlists())
      setLoaded(true);

    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/splash'>
          <Splash user={user} />
        </Route>
        <Route exact path='/login'>
          <LoginForm user={user} />
        </Route>
        <Route exact path='/signup'>
          <SignUpForm user={user} />
        </Route>
        <MainWrapper user={user}>
          <Switch>
            <Route exact path='/'>
              {user ? <Dashboard /> : <Redirect to='/splash' />}
            </Route>
            <ProtectedRoute exact path='/stocks/:symbol'>
              <Stock />
            </ProtectedRoute>
            <Route>
              <h1>404 Not Found</h1>
            </Route>
          </Switch>
        </MainWrapper>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
