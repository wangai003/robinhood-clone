import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../store/session';
import './ProfileButton.css';

const DropDownMenu = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.session.user);

  const onLogout = async e => {
    await dispatch(logout());
    history.push('/splash');
  };

  return (
    <div className='profileMenu' onClick={e => e.stopPropagation()}>
      <p>
        {user.first_name} {user.last_name}
      </p>
      <button className='btn' onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

const ProfileButton = () => {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  return (
    <div className='profile'>
      <button className='profileButton navText' onClick={() => !showMenu && setShowMenu(true)}>
        Profile
      </button>
      {showMenu && <DropDownMenu />}
    </div>
  );
};

export default ProfileButton;
