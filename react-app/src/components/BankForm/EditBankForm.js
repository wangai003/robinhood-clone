import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';


const EditBankForm = ({ userId, bankId, account, n }) => {

  const [errors, setErrors] = useState([]);
  const [bank, setBank] = useState(1);
  const [bankList, setBankList] = useState([]);
  const [name, setName] = useState(name);
  const [accountNumber, setAccountNumber] = useState(accountNumber);

  const sessionUser = useSelector((state) => state.session.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const updateBank = (e) => {
    setBank(e.target.value)
  }

  const updateName = (e) => {
    setName(e.target.value);
  };

  const updateAccountNumber = (e) => {
    setAccountNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBank = {
      userId, bank, accountNumber, name
    };

    // dispatch(editReview(updatedReview))

    // history.push(`/lairs`);

    // reset();
  };

  return (
    <div className="edit-review-container">

      <h1>Edit Linked Accounts</h1>

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

    </div>
  );

};

export default EditBankForm;
