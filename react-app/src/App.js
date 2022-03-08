import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Splash from './components/splash';
import MainWrapper from './components/MainWrapper';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { authenticate } from './store/session';

function App() {
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
          <Splash />
        </Route>
        <MainWrapper>
          <Switch>
            <Route exact path='/login'>
              <LoginForm />
            </Route>
            <Route exact path='/sign-up'>
              <SignUpForm />
            </Route>
            <ProtectedRoute exact path='/'>
              <h1>My Home Page</h1>
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
