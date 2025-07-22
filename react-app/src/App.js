import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authenticate } from './store/session';
import { getAllStocks } from './store/stocks';
import MainWrapper from './components/MainWrapper';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import Splash from './components/Splash';
import Dashboard from './components/Dashboard';
import Stock from './components/Stock';
import BankForm from './components/BankForm';
import { getBanks } from './store/bank';
import Footer from './components/footer';
import DemoBanner from './components/DemoBanner';
import DemoNotifications from './components/DemoNotifications';
import DemoDataUpdater from './components/DemoDataUpdater';
import DemoStockTicker from './components/DemoStockTicker';
import Staking from './components/Staking';
import KenyanStocks from './components/KenyanStocks';
import DeFiFeatures from './components/DeFiFeatures';
import BlockchainStatus from './components/BlockchainStatus';
function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      await dispatch(getAllStocks());
      await dispatch(getBanks());

      setLoaded(true);
    })();
  }, [dispatch]);

  return (
    loaded && (
      <BrowserRouter>
        <DemoBanner />
        <DemoNotifications />
        <DemoDataUpdater />
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
                <Footer></Footer>
              </Route>
              <ProtectedRoute exact path='/add-funds'>
                <BankForm />
              </ProtectedRoute>
              <ProtectedRoute exact path='/stocks/:symbol'>
                <Stock />
              </ProtectedRoute>
              <ProtectedRoute exact path='/staking'>
                <Staking />
              </ProtectedRoute>
              <ProtectedRoute exact path='/kenyan-stocks'>
                <KenyanStocks />
              </ProtectedRoute>
              <ProtectedRoute exact path='/defi'>
                <DeFiFeatures />
              </ProtectedRoute>
              <Route>
                <h1>404 Not Found</h1>
              </Route>
            </Switch>
          </MainWrapper>
        </Switch>
        <DemoStockTicker />
        <BlockchainStatus />
      </BrowserRouter>
    )
  );
}

export default App;
