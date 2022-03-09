import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { addBank, deleteBank } from '../store/bank';
import EditBank from './EditBank';

const BankForm = () => {

  const [errors, setErrors] = useState([]);
  const [bank, setBank] = useState(1);
  const [bankList, setBankList] = useState([]);
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const [myBanks, setMyBanks] = useState([]);

  const [info, setInfo] = useState(false)

  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  let userId;
  if (user) {
    userId = user.id
  }

  useEffect(() => {
    async function fetchBanks() {
      const response = await fetch('/api/banks/');
      const responseData = await response.json();
      setBankList(responseData);
      setInfo(false)
    }

    async function fetchLinked() {
      const response = await fetch('/api/banks/linked');
      const responseData = await response.json();
      setMyBanks(responseData);
      setInfo(false)
    }

    fetchBanks();
    fetchLinked();
  }, [info]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await dispatch(addBank(userId, bank, accountNumber, name));
    if (data) {
      setErrors(data);
    }

    setInfo(true)

  };

  const handleClick = async (e) => {
    e.preventDefault();

    let id = e.target.id

    const data = await dispatch(deleteBank(id));

    if (data) {
      alert(data)
    }

    setInfo(true)
  }

  const updateBank = (e) => {
    setBank(e.target.value)
  }

  const updateName = (e) => {
    setName(e.target.value);
  };

  const updateAccountNumber = (e) => {
    setAccountNumber(e.target.value);
  };

  if (!user) {
    return <Redirect to='/login' />;
  }

  return (

    <>
      <div>

        {myBanks.length > 0 && (
          <h2> My Linked Accounts: </h2>
        )}

        {myBanks.length < 1 && (
          <h2> Please add a bank account: </h2>
        )}

        <table>
          {myBanks.length > 0 && (
            <thead>

              <th>Name </th>
              <th>Account Number </th>
              <th>Edit </th>
              <th>Delete </th>
              <th>Bank ID </th>

            </thead>


          )}
          <tbody>

            {myBanks?.map(bank => (
              <tr>
                <td>{bank.name}</td>
                <td>{bank.account_number}</td>

                {/* <td><button id={bank.id}>Edit</button></td> */}
                <EditBank userId={userId} name={bank.name} accountNumber={bank.account_number} id={bank.id} bankId={bank.bank_id}/>

                <td><button id={bank.id} onClick={handleClick}>Delete</button></td>
                <td>{bank.id}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <br></br>

      <form onSubmit={handleSubmit}>
        <div>
          {errors.map((error, ind) => (

            <div key={ind}>{error.split(':')[1]}</div>

          ))}
        </div>

        <div>
          <input type="hidden" id="userId" name="userId" value={userId} />
        </div>

        <div>
          <label htmlFor='bank_id'>Banks </label>
          <select
            name='bank_id'
            type='text'
            value={bank}
            onChange={updateBank}
            required={true}
          >

            {bankList.map(bank => (
              <option value={bank.id}> {bank.name} </option>
            ))}

          </select>
        </div>



        <div>
          <label htmlFor='accountNumber'>Account Number </label>
          <input
            name='accountNumber'
            type='text'
            placeholder='Account Number'
            required={true}
            value={accountNumber}
            onChange={updateAccountNumber}
          />
        </div>


        <div>
          <label htmlFor='name'>Name </label>
          <input
            name='name'
            type='text'
            placeholder='Name'
            value={name}
            onChange={updateName}
          />
        </div>

        <button type='submit'>Add Bank</button>
      </form>
    </>
  );

};

export default BankForm;
