import { useSelector } from 'react-redux';
import SpotCard from '../../components/SpotCard/SpotCard';
import './Splash.css';

const Splash = () => {
  const spots = useSelector((state) => state.spots.allSpots);

  return (
    <div className="container">
      {Object.values(spots).map((spot) => (
        <SpotCard
          key={spot.id}
          price={spot.price}
          city={spot.city}
          state={spot.state}
          avgRating={spot.avgRating}
          previewImage={spot.previewImage}
        />
      ))}
    </div>
  );
};

export default Splash;
