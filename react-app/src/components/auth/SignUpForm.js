import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { signUp } from '../../store/session';
import './SignUpForm.css'

const SignUpForm = ({ user }) => {
  const [errors, setErrors] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const dispatch = useDispatch();

  const onSignUp = async e => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(firstName, lastName, email, password));
      if (data) {
        setErrors(data);
      }
    }
  };

  const updateFirstName = e => {
    setFirstName(e.target.value);
  };

  const updateLastName = e => {
    setLastName(e.target.value);
  };

  const updateEmail = e => {
    setEmail(e.target.value);
  };

  const updatePassword = e => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = e => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='signup-page-container'>
      <div id='signup-img-wrapper'>
      <img id='signup-form-img' src="/static/signup2.png" />
      </div>
      <div className='signup-form-container'>
        <form className='sign-up-form' onSubmit={onSignUp}>
          <div>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div>
            <label>First Name</label>
            <input type='text' name='firstName' onChange={updateFirstName} value={firstName}></input>
          </div>
          <div>
            <label>Last Name</label>
            <input type='text' name='lastName' onChange={updateLastName} value={lastName}></input>
          </div>
          <div>
            <label>Email</label>
            <input type='text' name='email' onChange={updateEmail} value={email}></input>
          </div>
          <div>
            <label>Password</label>
            <input type='password' name='password' onChange={updatePassword} value={password}></input>
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type='password'
              name='repeat_password'
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
            ></input>
          </div>
          <button className='sign-up-button' type='submit'>Sign Up</button>
          <div>
            <span>Already a user? </span>
            <Link className='page-link' to='/login'>Log in here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
