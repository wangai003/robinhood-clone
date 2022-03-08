import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Splash from './components/splash';
import Dashboard from './components/dashboard';
import MainWrapper from './components/MainWrapper';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { authenticate } from './store/session';

function App() {
  const user = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
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
        <MainWrapper>
          <Switch>
            <Route exact path='/login'>
              <LoginForm user={user} />
            </Route>
            <Route exact path='/signup'>
              <SignUpForm user={user} />
            </Route>
            <Route exact path='/'>
              {user ? <Dashboard /> : <Redirect to='/splash' />}
            </Route>
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
