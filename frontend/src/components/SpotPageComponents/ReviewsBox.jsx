import { FaStar } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import './ReviewsBox.css';
import { useEffect } from 'react';
import { getCurrentUserReviews } from '../../store/reviews';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import PostReviewModal from '../PostReviewModal/PostReviewModal';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';

const ReviewsBox = ({ reviewCount, avgRating, reviews }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.currentSpot);
  const currentUserReviews = useSelector(
    (state) => state.reviews.currentUserReviews
  );

  if (avgRating === null) {
    avgRating = 'NEW';
  } else {
    avgRating = avgRating.toFixed(2);
  }

  useEffect(() => {
    if (sessionUser) {
      dispatch(getCurrentUserReviews());
    }
  }, [dispatch, sessionUser]);

  const userReviewCurrentSpot = Object.values(currentUserReviews).find(
    (review) => review.spotId === spot.id
  );

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
      {sessionUser &&
        !userReviewCurrentSpot &&
        sessionUser.id !== spot.ownerId && (
          <OpenModalButton
            buttonText={'Post a review'}
            onButtonClick={() => console.log('tester')}
            modalComponent={<PostReviewModal />}
          />
        )}
      <div className="review-display">
        {reviews && reviews.length > 0 ? (
          <div>
            {reviews.map((review, index) => (
              <div className="solo-review" key={index}>
                <div>{review.User.firstName.toUpperCase()}</div>
                <div>{review.createdAt.slice(0, 7)}</div>
                <div>{review.review}</div>
                {sessionUser && sessionUser.id === review.userId && (
                  <OpenModalButton
                    buttonText={'Delete'}
                    onButtonClick={() => console.log('Delete review')}
                    modalComponent={<DeleteReviewModal reviewId={review.id} />}
                  />
                )}
              </div>
            ))}
          </div>
        ) : sessionUser && sessionUser.id !== spot.ownerId ? (
          <div>Be the first to post a review!</div>
        ) : (
          <div>No reviews yet</div>
        )}
      </div>
    </div>
  );
};

export default ReviewsBox;
