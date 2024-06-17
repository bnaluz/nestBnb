import { FaStar } from 'react-icons/fa6';
import './SpotCard.css';

const SpotCard = ({ avgRating, city, previewImage, price, state, name }) => {
  return (
    <div className="spot-card">
      <div className="spot-image-container">
        <img src={previewImage} alt={name} className="spot-image" />
      </div>
      <div className="spot-info">
        <h3 className="spot-title">{name}</h3>
        <p className="spot-location">
          {city}, {state}
        </p>
        <p className="spot-rating">
          {avgRating === null || avgRating === undefined ? (
            'NEW'
          ) : Number.isInteger(avgRating) ? (
            <div>
              {avgRating} <FaStar />
            </div>
          ) : (
            <div>
              {avgRating.toFixed(2)} <FaStar />
            </div>
          )}
        </p>
        <p className="spot-price">$ {price}/night</p>
      </div>
    </div>
  );
};

export default SpotCard;
