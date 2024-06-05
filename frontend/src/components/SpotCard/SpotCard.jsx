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
          <p>{avgRating}</p>
        </div>
        <div>$ {price}/night</div>
      </div>
    </div>
  );
};

export default SpotCard;
