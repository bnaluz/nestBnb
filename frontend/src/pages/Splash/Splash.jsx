import { useSelector } from 'react-redux';
import SpotCard from '../../components/SpotCard/SpotCard';
import './Splash.css';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const spots = useSelector((state) => state.spots.allSpots);
  const navigate = useNavigate();

  const handleSpotRouter = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="container">
      {Object.values(spots).map((spot) => (
        <div
          className="tooltip"
          key={spot.id}
          onClick={() => handleSpotRouter(spot.id)}
        >
          <span className="tooltip-text">{spot.name}</span>

          <SpotCard
            onClick={handleSpotRouter}
            key={spot.id}
            price={spot.price}
            city={spot.city}
            state={spot.state}
            avgRating={spot.avgRating}
            previewImage={spot.previewImage}
          />
        </div>
      ))}
    </div>
  );
};

export default Splash;
