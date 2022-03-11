import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import NavBar from './Navigation';
import { loadPortfolio } from '../store/portfolio';

const MainWrapper = props => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await dispatch(loadPortfolio());

      setLoaded(true);
    })();
  }, [dispatch]);

  return (
    loaded && (
      <main>
        <div className='content'>
          <Route {...props}>
            <NavBar user={props.user} />
            {props.children}
          </Route>
        </div>
      </main>
    )
  );
};

export default MainWrapper;
