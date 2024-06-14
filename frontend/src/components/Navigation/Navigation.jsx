import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton.jsx';
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const createSpotRouteHandler = (e) => {
    e.preventDefault();
    navigate('/spots/create');
  };

  return (
    <div className="navbar">
      <div>
        <NavLink to="/">
          <img src="../../Nest.png"></img>
        </NavLink>
      </div>

      {isLoaded && (
        <div>
          <div className="logged-in">
            {sessionUser ? (
              <div onClick={createSpotRouteHandler} className="create">
                Create a nest
              </div>
            ) : (
              <></>
            )}
            <div className="userMenu">
              <ProfileButton user={sessionUser} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
