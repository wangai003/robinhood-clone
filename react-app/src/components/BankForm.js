import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../store/session';

const BankForm = () => {

  const banks = ['Chase', 'Wells Fargo', 'Bank of America', 'Capital One', 'Navy Federal Credit Union', 'USAA', 'U.S. Bank', 'Citibank', 'Chime', 'Citizens Bank', 'TD Bank', 'Ally Bank', 'Fidelity', 'Huntington Bank', 'Charles Swab']


  const [errors, setErrors] = useState([]);
  const [bank, setBank] = useState('');
  const [amount, setAmount] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateBank = (e) => {
    setBank(e.target.value)
  }

  const updateAmount = (e) => {
    setAmount(e.target.value)
  }

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <form onSubmit={onLogin}>
      <div>
        {errors.map((error, ind) => (
          <div key={ind}>{error}</div>
        ))}
      </div>
      <div>
        <label htmlFor='banks'>Banks </label>
        <select
          name='banks'
          type='text'
          value={bank}
          onChange={updateBank}
          required={true}
        >

        {banks.map(bank => (
          <option> {bank} </option>
        ))}

        </select>
      </div>
      <div>
        <label htmlFor='amount'>Amount </label>
        <input
          name='amount'
          type='number'
          placeholder='Amount'
          required={true}
          value={amount}
          onChange={updateAmount}
        />
      </div>

      <div>
        <label htmlFor='email'>helloh</label>
        <input
          name='email'
          type='text'
          placeholder='Email'
          value={email}
          onChange={updateEmail}
        />
      </div>

      {/* <div>
        <label htmlFor='password'>Password</label>
        <input
          name='password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={updatePassword}
        />
      </div> */}

        <button type='submit'>Add Bank</button>
    </form>
  );
};

export default BankForm;
