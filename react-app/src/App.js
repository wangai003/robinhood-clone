import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authenticate } from './store/session';
import MainWrapper from './components/MainWrapper';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import Splash from './components/Splash';
import Dashboard from './components/Dashboard';
import Stock from './components/Stock';
import BankForm from './components/BankForm';
import { getBanks } from './store/bank';
import { getAccounts } from './store/bank';

function App() {
  const user = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      await dispatch(getBanks());
      await dispatch(getAccounts());
      setLoaded(true);
    })();
  }, [dispatch]);

  return (
    loaded && (
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
              <ProtectedRoute exact path='/add-funds'>
                <BankForm />
              </ProtectedRoute>
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
    )
  );
}

export default App;
