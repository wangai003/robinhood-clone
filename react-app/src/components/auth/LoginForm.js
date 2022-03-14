import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { login, demo } from '../../store/session';
import './LoginForm.css';

const LoginForm = ({ user }) => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const onLogin = async e => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = e => {
    setEmail(e.target.value);
  };

  const updatePassword = e => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='login-page-container'>
      <img id='login-form-img' src="/static/rh-login-image.jpg" />
      <div className='login-form-container'>
        <form className="login-form" onSubmit={onLogin}>
          <h2>Log in to Robinsock</h2>
          <div>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div>
            <label htmlFor='email'>Email</label>
            <input name='email' type='text' placeholder='Email' value={email} onChange={updateEmail} />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              name='password'
              type='password'
              placeholder='Password'
              value={password}
              onChange={updatePassword}
            />
            <div>
              <button className='login-button' type='submit'>Login</button>
              <button className='login-button' type='button' onClick={() => dispatch(demo())}>

                Login as demo
              </button>

            </div>
            <div>
              <span>Not on Robinsock? </span>
              <Link className='page-link' to='/signup'>Create an account</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
