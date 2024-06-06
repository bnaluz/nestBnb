import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getSpotDetail } from '../../store/spots';
import { useEffect } from 'react';

const SpotDetailPage = () => {
  const spotId = useParams();
  console.log(spotId);

  const spot = useSelector((state) => state.spots.currentSpot);
  console.log(spot);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotDetail(spotId.spotId));
  }, [dispatch, spotId]);

  console.log('SpotDetailPage');
  return (
    <div className="test">
      <div>{spot.name}</div>
      <div>{spot.address}</div>
    </div>
  );
};

export default SpotDetailPage;
