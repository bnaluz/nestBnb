import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CiUser } from 'react-icons/ci';
import { AiOutlineMenu } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/');
    closeMenu();
  };

  const manageSpotHandler = (e) => {
    e.preventDefault();
    navigate('spots/user-spots');
  };

  const ulClassName = 'profile-dropdown' + (showMenu ? '' : ' hidden');

  return (
    <>
      <button className="profile-icon" onClick={toggleMenu}>
        <AiOutlineMenu size={25} />
        <CiUser size={25} />
      </button>
      <div className="menu">
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <li>Hello, {user.username}</li>

              <li>{user.email}</li>
              <li>
                <button onClick={manageSpotHandler}>Manage Spots</button>
              </li>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <OpenModalButton
                  buttonText="Log In"
                  onButtonClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </li>
              <li>
                <OpenModalButton
                  buttonText="Sign Up"
                  onButtonClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default ProfileButton;
