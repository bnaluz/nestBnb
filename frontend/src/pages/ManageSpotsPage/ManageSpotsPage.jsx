import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserSpots, getSpotDetail } from '../../store/spots';
import SpotCard from '../../components/SpotCard/SpotCard';
import OpenModalButton from '../../components/OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../../components/DeleteSpotModal/DeleteSpotModal';
import './ManageSpotsPage.css';

const ManageSpotsPage = () => {
  const dispatch = useDispatch();
  const userSpots = useSelector((state) => state.spots.userSpots);
  const navigate = useNavigate();

  const postNavigateHandler = (e) => {
    e.preventDefault();
    navigate('/spots/create');
  };

  const handleSpotRouter = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
  };

  const handleUpdate = async (e, spotId) => {
    e.stopPropagation();
    e.preventDefault();
    await dispatch(getSpotDetail(spotId));
    navigate('/spots/update');
  };

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);

  const checkSpots = () => {
    if (Object.keys(userSpots).length === 0) {
      return (
        <div className="no-spots">
          <p>No spots available.</p>
          <button className="post-spot-button" onClick={postNavigateHandler}>
            Post a Spot
          </button>
        </div>
      );
    }

    return (
      <div className="spot-list">
        {Object.values(userSpots).map((spot) => (
          <div
            key={spot.id}
            className="spot-item"
            onClick={() => handleSpotRouter(spot.id)}
          >
            <SpotCard
              avgRating={spot.avgRating}
              city={spot.city}
              previewImage={spot.previewImage}
              price={spot.price}
              state={spot.state}
              name={spot.name}
            />
            <div className="spot-card-actions">
              <button
                className="update-button"
                onClick={(e) => handleUpdate(e, spot.id)}
              >
                Update
              </button>
              <OpenModalButton
                buttonText={'Delete'}
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
                onButtonClick={(e) => handleDelete(e, spot.id)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="manage-header">Manage Your Spots</div>
      <div className="manage-container">{checkSpots()}</div>
    </div>
  );
};

export default ManageSpotsPage;
