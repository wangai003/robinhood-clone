import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Modal2 } from './context/Modal';
import { editBank } from '../../store/bank';

function EditBank({ userId, name, accountNumber, id, bankId }) {
  const [showModal, setShowModal] = useState(false);

  const [updatedBank, setUpdatedBank] = useState(bankId);
  const [updatedName, setUpdatedname] = useState(name);
  const [updatedAccountNumber, setUpdatedAccountNumber] = useState(accountNumber);

  const [updatedId, setUpdatedId] = useState(id);

  const [bankList, setBankList] = useState([]);
  const [info, setInfo] = useState(false);
  const [errors, setErrors] = useState([]);

  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchBanks() {
      const response = await fetch('/api/banks/');
      const responseData = await response.json();
      setBankList(responseData);
      setInfo(false);
    }

    // async function fetchLinked() {
    //   const response = await fetch('/api/banks/linked');
    //   const responseData = await response.json();
    //   setMyBanks(responseData);
    //   setInfo(false)
    // }

    fetchBanks();
    // fetchLinked();
  }, [info]);

  const updateBank = e => {
    setUpdatedBank(e.target.value);
  };

  const updateName = e => {
    setUpdatedname(e.target.value);
  };

  const updateAccountNumber = e => {
    setUpdatedAccountNumber(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    let newBank = {
      userId,
      bankId: updatedBank,
      accountNumber: updatedAccountNumber,
      name: updatedName,
      id,
    };

    console.log('newBank -----> ', newBank);

    const data = await dispatch(editBank(newBank));

    if (data) {
      setErrors(data);
    }

    setInfo(true);
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Edit Bank</button>

      {showModal && (
        <Modal2 title={`Edit bank: ${name}`} onClose={() => setShowModal(false)} show={showModal}>
          <h1>name: {name}</h1>
          <h1>account: {accountNumber}</h1>
          <h1>id: {id}</h1>
          <h1>bankId: {bankId}</h1>
          <h1>userId: {userId}</h1>

          <form onSubmit={handleSubmit}>
            <div>
              {/* {errors?.map((error, ind) => (
            <div key={ind}>{error.split(':')[1]}</div>
          ))} */}
            </div>

            <div>
              <input type='hidden' id='userId' name='userId' value={userId} />
            </div>

            <div>
              <label htmlFor='bank_id'>Banks </label>
              <select
                name='bank_id'
                type='text'
                value={updatedBank}
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
