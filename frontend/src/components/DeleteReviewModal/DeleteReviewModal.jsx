import { useDispatch, useSelector } from 'react-redux';
import { deleteReview } from '../../store/reviews';
import { useModal } from '../../context/Modal';
import { getSpotDetail } from '../../store/spots';
import { getReviews } from '../../store/reviews';

const DeleteReviewModal = ({ reviewId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const spotId = useSelector((state) => state.spots.currentSpot.id);

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteReview(reviewId));
    await dispatch(getSpotDetail(spotId));
    await dispatch(getReviews(spotId));
    closeModal();
  };

  return (
    <div className="delete-modal">
      <div className="delete-header">Confirm Delete</div>
      <div>Are you sure you want to delete this review?</div>
      <div>
        <button
          className="delete-button"
          onClick={handleDelete}
        >{`YES (Delete Review)`}</button>
        <button
          className="close-button"
          onClick={() => closeModal()}
        >{`NO (Keep Review)`}</button>
      </div>
    </div>
  );
};

export default DeleteReviewModal;
