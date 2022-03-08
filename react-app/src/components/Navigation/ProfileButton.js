import { useState, useEffect } from 'react';
import ProfileMenu from './ProfileMenu';
import './ProfileButton.css';

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
      {showMenu && <ProfileMenu />}
    </div>
  );
};

export default ProfileButton;
