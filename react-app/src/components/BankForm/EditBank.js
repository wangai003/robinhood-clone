import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Modal2 } from './context/Modal';
import { editBankAccount } from '../../store/portfolio/bankAccount';
import './Bank.css';

function EditBank({ userId, name, accountNumber, id, bankId }) {
  const [showModal, setShowModal] = useState(false);

  const [updatedBank, setUpdatedBank] = useState(bankId);
  const [updatedName, setUpdatedname] = useState(name);
  const [updatedAccountNumber, setUpdatedAccountNumber] = useState(accountNumber);

  const [errors, setErrors] = useState([]);

  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const updateName = e => {
    setUpdatedname(e.target.value);
  };

  const updateAccountNumber = e => {
    setUpdatedAccountNumber(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors([]);
    let data = [];

    let newBank = {
      userId,
      bankId: updatedBank,
      name: updatedName,
      accountNumber: updatedAccountNumber,
      id,
    };

    data = await dispatch(editBankAccount(newBank));

    if (data) {
      setErrors(data);
    }

    if (data === null) {
      setShowModal(false);
    }
  };

  return (
    <>
      <button className='bank-button' onClick={() => setShowModal(true)}>Edit Bank</button>

      {showModal && (
        <Modal2
          title={`Edit bank information for ${name}:`}
          onClose={() => setShowModal(false)}
          show={showModal}
        >
          {/* <h1>name: {name}</h1>
          <h1>account: {accountNumber}</h1>
          <h1>id: {id}</h1>
          <h1>bankId: {bankId}</h1>
          <h1>userId: {userId}</h1> */}

          <form onSubmit={handleSubmit}>
            <div className='bank-errors'>
              {errors?.map((error, ind) => (
                <div key={ind}>{error.split(':')[1]}</div>
              ))}
            </div>

            <div>
              <input type='hidden' id='userId' name='userId' value={userId} />
            </div>

            <div>
              <label htmlFor='accountNumber'>Account Number </label>
              <input
                name='accountNumber'
                type='text'
                placeholder='Account Number'
                required={true}
                value={updatedAccountNumber}
                onChange={updateAccountNumber}
              />
            </div>

            <div>
              <label htmlFor='name'>Name </label>
              <input
                name='name'
                type='text'
                placeholder='Name'
                value={updatedName}
                onChange={updateName}
              />
            </div>

            <button type='submit'>Submit Changes</button>
          </form>
        </Modal2>
      )}
    </>
  );
}

export default EditBank;
