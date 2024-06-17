import { useSelector } from 'react-redux';
import './SpotPageCalloutBox.css';
import { FaStar } from 'react-icons/fa6';

const SpotPageCalloutBox = () => {
  const spot = useSelector((state) => state.spots.currentSpot);
  console.log(spot);

  const handleAlert = (e) => {
    e.preventDefault();
    alert('Feature coming soon');
  };

  return (
    <div className="callout-container">
      <div>
        <div className="info-line">
          <div className="price">{`${spot.price}/night`} </div>
          <div className="rating-reviews">
            <div>
              <FaStar size={15} />
              {spot.avgRating === null ? 'NEW' : `${spot.avgRating.toFixed(2)}`}
            </div>
            {spot.avgRating !== null && spot.numReviews > 0 && <div>{`·`}</div>}
            {spot.numReviews > 0 && (
              <div>
                {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <button className="alert-button" onClick={handleAlert}>
          RESERVE
        </button>
      </div>
    </div>
  );
};

export default SpotPageCalloutBox;
