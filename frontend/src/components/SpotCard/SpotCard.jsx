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
          {avgRating === null
            ? 'NEW'
            : Number.isInteger(avgRating)
            ? avgRating
            : avgRating.toFixed(2)}
        </p>
        <p className="spot-price">$ {price}/night</p>
      </div>
    </div>
  );
};

export default SpotCard;
