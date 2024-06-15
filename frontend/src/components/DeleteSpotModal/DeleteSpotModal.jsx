import './DeleteSpotModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots';

const DeleteSpotModal = ({ spotId }) => {
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpot(spotId)).then(() => closeModal());
  };
  return (
    <div className="delete-modal">
      <div className="delete-header">Confirm Delete</div>
      <div>Are you sure you want to delete this listing?</div>
      <div>
        <button
          className="delete-button"
          onClick={handleDelete}
        >{`YES (Delete Spot)`}</button>
        <button
          className="close-button"
          onClick={() => closeModal()}
        >{`NO (Keep Spot)`}</button>
      </div>
    </div>
  );
};

export default DeleteSpotModal;
