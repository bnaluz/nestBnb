import './SpotPageCalloutBox.css';
import { FaStar } from 'react-icons/fa6';

const SpotPageCalloutBox = ({ price, avgRatings, reviewCount }) => {
  const handleAlert = (e) => {
    e.preventDefault();
    alert('Feature coming soon');
  };

  if (avgRatings === null) {
    avgRatings = 'NEW';
  } else {
    avgRatings = avgRatings.toFixed(1);
  }
  return (
    <div className="callout-container">
      <div>
        <div className="info-line">
          <div className="price">${price}/night </div>
          <div className="rating-reviews">
            <div>
              <FaStar size={15} />
              {avgRatings}
            </div>
            <div>{reviewCount} reviews</div>
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
