import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getSpotDetail } from '../../store/spots';
import { getReviews } from '../../store/reviews';
import { useEffect, useState } from 'react';

import SpotPageCalloutBox from '../../components/SpotPageComponents/SpotPageCalloutBox';
import './SpotDetailPage.css';
import ReviewsBox from '../../components/SpotPageComponents/ReviewsBox';

const SpotDetailPage = () => {
  const spotId = useParams();

  const spot = useSelector((state) => state.spots.currentSpot);
  const reviews = useSelector((state) => state.reviews.reviews);

  const reviewsArr = reviews.Reviews;

  const [isLoaded, setIsLoaded] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotDetail(spotId.spotId));
    dispatch(getReviews(spotId.spotId)).then(() => setIsLoaded(true));
  }, [dispatch, spotId]);

  return isLoaded ? (
    <div className="test">
      <h1>{spot.name}</h1>
      <h3>
        {spot.city}, {spot.state}, {spot.country}
      </h3>

      <div className="image-container">
        <div className="image large">
          <img src={spot.previewImage} alt="" />
        </div>

        {spot.SpotImages &&
          spot.SpotImages.slice(0, 4).map((image) => (
            <div key={image.id} className="image small">
              <img src={image.url} alt="" />
            </div>
          ))}
      </div>

      <div className="info-box">
        <div className="owner-description">
          <h2>
            Hosted By: {spot.Owner.firstName}, {spot.Owner.lastName}{' '}
          </h2>

          <div>Description: {spot.description}</div>
        </div>
        <SpotPageCalloutBox
          price={spot.price}
          avgRatings={spot.avgRating}
          reviewCount={spot.numReviews}
        />
      </div>

      <ReviewsBox
        reviewCount={spot.numReviews}
        avgRating={spot.avgRating}
        reviews={reviewsArr}
      />
    </div>
  ) : (
    <div className="loading">Loading..</div>
  );
};

export default SpotDetailPage;
