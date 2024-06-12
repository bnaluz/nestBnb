import { FaStar } from 'react-icons/fa6';
import './ReviewsBox.css';

const ReviewsBox = ({ reviewCount, avgRating, reviews }) => {
  if (avgRating === null) {
    avgRating = 'NEW';
  } else {
    avgRating = avgRating.toFixed(1);
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <div>
          <FaStar size={15} /> {avgRating}
        </div>
        {reviewCount > 0 ? (
          <>
            <div>{'·'}</div>
            <div>
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="review-display">
        {reviews && reviews.length > 0 ? (
          <div>
            {reviews.map((review, index) => (
              <div className="solo-review" key={index}>
                <div>{review.User.firstName.toUpperCase()}</div>
                <div>{review.createdAt.slice(0, 7)}</div>
                <div>{review.review}</div>
              </div>
            ))}
          </div>
        ) : (
          <div>No reviews yet, be the first!</div>
        )}
      </div>
    </div>
  );
};

export default ReviewsBox;
