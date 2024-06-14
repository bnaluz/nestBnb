import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';

import './PostReviewModal.css';
import { postSpotReview } from '../../store/reviews';

const PostReviewModal = () => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [disabled, setDisabled] = useState(true);

  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.currentSpot);
  const currentUser = useSelector((state) => state.session.user);

  const { closeModal } = useModal();

  const [errors, setErrors] = useState({});

  const handleRating = (index) => {
    setRating(index);
  };

  const handleHover = (index) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_Id: currentUser.id,
      spot_Id: spot.id,
      review: review,
      stars: rating,
    };

    dispatch(postSpotReview(payload))
      .then(() => closeModal())
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
        return console.log(errors);
      });
  };

  useEffect(() => {
    if (review.length > 10 && rating > 1) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [review, rating]);

  return (
    <div className="post-review-modal-container">
      <div className="post-review-header">How was your stay?</div>
      {errors && (
        <div>
          {Object.values(errors).map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
      <form className="post-modal" onSubmit={handleSubmit}>
        <textarea
          placeholder="Leave your review here"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((index) => (
            <span
              key={index}
              className={`star ${
                index <= (hoverRating || rating) ? 'filled' : ''
              }`}
              onClick={() => handleRating(index)}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={handleMouseLeave}
            >
              &#9733;
            </span>
          ))}
          <span> Stars</span>
        </div>
        <button type="submit" disabled={disabled}>
          Submit Your Review
        </button>
      </form>
    </div>
  );
};

export default PostReviewModal;
