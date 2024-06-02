import './Navigation.css';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton.jsx';
import OpenModalButton from '../OpenModalButton/OpenModalButton.jsx';
import LoginFormModal from '../LoginFormModal/LoginFormModal.jsx';

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionLinks = sessionUser ? (
    <>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    </>
  ) : (
    <>
      <li>
        <OpenModalButton
          buttonText={'Log In'}
          modalComponent={<LoginFormModal />}
        />
      </li>
      <li>
        <NavLink to="/signup">Sign Up</NavLink>
      </li>
    </>
  );

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
};

export default Navigation;
