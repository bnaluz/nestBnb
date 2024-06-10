import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getSpotDetail } from '../../store/spots';
import { getReviews } from '../../store/reviews';
import { useEffect } from 'react';
import './SpotDetailPage.css';

const SpotDetailPage = () => {
  const spotId = useParams();
  console.log(spotId);

  const spot = useSelector((state) => state.spots.currentSpot);
  console.log(spot);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotDetail(spotId.spotId));
    dispatch(getReviews(spotId.spotId));
  }, [dispatch, spotId]);

  console.log('SpotDetailPage');
  return (
    <div className="test">
      <div>{spot.name}</div>
      <div>
        {spot.city}, {spot.state}, {spot.country}
      </div>
      <div>FOR SPOT IMAGES</div>
      <div>For SPOT OWNER INFO OWNER ID as ownerId: {spot.ownerId}</div>
    </div>
  );
};

export default SpotDetailPage;
