import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton.jsx';
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="navbar">
      <div>
        <NavLink to="/">
          <img src="../../Nest.png"></img>
        </NavLink>
      </div>

      {isLoaded && (
        <div className="userMenu">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
};

export default Navigation;
