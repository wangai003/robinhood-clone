import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { addAccount, deleteBank } from '../../store/bank';
import EditBank from './EditBank';
import AddBuyingPower from './AddBuyingPower';
import './Bank.css'


const BankForm = () => {

  const [errors, setErrors] = useState([]);

  const [bank, setBank] = useState(1);

  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const [info, setInfo] = useState(false)

  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  let userId;
  if (user) {
    userId = user.id
  }

  let banks = useSelector(state => state.bank?.bank)
  let myAccounts = Object.values(useSelector(state => state.bank?.linked))


  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([])

    const data = await dispatch(addAccount(userId, bank, accountNumber, name));
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

  return (

    <>
      <div className='table-outer-container'>
        <div className='table-inner-container'>

          {myAccounts?.length > 0 && (
            <h3> My Linked Accounts: </h3>
          )}

          {myAccounts?.length < 1 && (
            <h3> Please add a bank account: </h3>
          )}

          <table className='linked-accounts-table'>
            {myAccounts?.length > 0 && (
              <thead>

                <th>Name </th>
                <th>Bank </th>
                <th>Account Number </th>

                {/* <th>Edit </th>
              <th>Delete </th> */}
                {/* <th>Bank ID </th> */}

              </thead>


            )}
            <tbody>

              {myAccounts?.map(bank => (
                <tr>
                  <td>{bank.name}</td>
                  <td>{bank.bank_name}</td>
                  <td>{bank.account_number}</td>

                  <AddBuyingPower userId={userId} name={bank.name} accountNumber={bank.account_number} id={bank.id} bankId={bank.bank_id} />

                  <EditBank userId={userId} name={bank.name} accountNumber={bank.account_number} id={bank.id} bankId={bank.bank_id} />

                  <button id={bank.id} onClick={handleClick}>Delete</button>

                  {/* <td>{bank.id}</td> */}
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

      <br></br>
      <div className='form-outer-container'>
        <div className='form-inner-container'>
          <form className='bank-form' onSubmit={handleSubmit}>
            <div className='bank-errors'>
              {errors.map((error, ind) => (

                <div key={ind}>{error.split(':')[1]}</div>

              ))}
            </div>

            <div>
              <input type="hidden" id="userId" name="userId" value={userId} />
            </div>

            <div className='sub-container'>
              <div>
                <label htmlFor='bank_id'>Select a bank </label>
                <select
                  className='select-bank'
                  name='bank_id'
                  type='text'
                  value={bank}
                  onChange={updateBank}
                  required={true}
                >

                  {banks?.map(bank => (
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

              <button className='add-bank-button' type='submit'>Add Bank</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );



};

export default BankForm;
