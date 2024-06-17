import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton.jsx';
import './Navigation.css';
import { useModal } from '../../context/Modal.jsx';
const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const createSpotRouteHandler = (e) => {
    e.preventDefault();
    navigate('/spots/create');
  };
  const closeModalFunction = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="navbar" onClick={closeModalFunction}>
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
