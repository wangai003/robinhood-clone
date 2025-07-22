import { isDemoMode, getDemoConfig } from '../config/demo';
import { MOCK_USER, simulateApiDelay } from '../services/mockData';

// constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

const setUser = user => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const initialState = { user: null };

export const authenticate = () => async dispatch => {
  if (isDemoMode()) {
    // In demo mode, check if user is already logged in (localStorage)
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      await simulateApiDelay(getDemoConfig().API_DELAY);
      dispatch(setUser(JSON.parse(demoUser)));
    }
    return;
  }

  const response = await fetch('/api/auth/', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
  }
};

export const login = (email, password) => async dispatch => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    
    // In demo mode, accept any credentials or specific demo credentials
    const demoConfig = getDemoConfig();
    if (email === demoConfig.DEMO_CREDENTIALS.email && password === demoConfig.DEMO_CREDENTIALS.password) {
      const userData = { ...MOCK_USER };
      localStorage.setItem('demoUser', JSON.stringify(userData));
      dispatch(setUser(userData));
      return null;
    } else {
      // For demo purposes, also accept any email/password combination
      const userData = { 
        ...MOCK_USER, 
        email: email,
        first_name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
      };
      localStorage.setItem('demoUser', JSON.stringify(userData));
      dispatch(setUser(userData));
      return null;
    }
  }

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.'];
  }
};

export const demo = () => async dispatch => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    const userData = { ...MOCK_USER };
    localStorage.setItem('demoUser', JSON.stringify(userData));
    dispatch(setUser(userData));
    return;
  }

  const response = await fetch('/api/auth/demo', {
    method: 'POST',
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.'];
  }
};

export const logout = () => async dispatch => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    localStorage.removeItem('demoUser');
    dispatch(removeUser());
    return;
  }

  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};

export const signUp = (firstName, lastName, email, password) => async dispatch => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    
    const userData = {
      ...MOCK_USER,
      first_name: firstName,
      last_name: lastName,
      email: email,
      // Start new users with some demo assets and watchlists
      assets: {
        'AAPL': { id: 1, symbol: 'AAPL', count: 5 }
      },
      buying_power: 10000.00
    };
    
    localStorage.setItem('demoUser', JSON.stringify(userData));
    dispatch(setUser(userData));
    return null;
  }

  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.'];
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload };
    case REMOVE_USER:
      return { user: null };
    default:
      return state;
  }
}
