import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { FaRegCircleUser } from 'react-icons/fa6';

const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout);
  };

  return (
    <div>
      <button>
        <FaRegCircleUser />
      </button>
      <ul className="profile-dropdown">
        <li>{user.username}</li>
        <li>
          {user.firstName} {user.lastName}
        </li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileButton;
