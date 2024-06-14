import './SpotCard.css';

const SpotCard = ({ avgRating, city, previewImage, price, state }) => {
  return (
    <div className="spot-card">
      <div>
        <img src={previewImage}></img>
      </div>
      <div>
        <div>
          <p>
            {city}, {state}
          </p>
          {avgRating === null ? (
            <p>NEW</p>
          ) : (
            <p>
              {Number.isInteger(avgRating) ? avgRating : avgRating.toFixed(2)}
            </p>
          )}
        </div>
        <div>$ {price}/night</div>
      </div>
    </div>
  );
};

export default SpotCard;
