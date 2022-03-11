import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Modal2 } from './context/Modal';
import { addBuyingPower } from '../../store/portfolio/buyingPower';

function AddBuyingPower({ userId, name, accountNumber, id, bankId }) {
  const [showModal, setShowModal] = useState(false);

  const [buyingPower, setBuyingPower] = useState(0);

  const [errors, setErrors] = useState([]);

  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const updateBp = e => {
    setBuyingPower(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors([]);

    const data = await dispatch(addBuyingPower(buyingPower));

    console.log('DATA -----------------> ', data);

    if (data) {
      setErrors(data);
    }

    if (data === null) {
      setShowModal(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Add BP</button>

      {showModal && (
        <Modal2
          title={`Transfer funds from ${name}`}
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
              <label htmlFor='buyingPower'>Buying Power </label>
              <input
                name='buyingPower'
                type='number'
                // placeholder='Buying Power'
                required={true}
                value={buyingPower}
                onChange={updateBp}
              />
            </div>

            <button type='submit'>Add BP</button>
          </form>
        </Modal2>
      )}
    </>
  );
}

export default AddBuyingPower;
