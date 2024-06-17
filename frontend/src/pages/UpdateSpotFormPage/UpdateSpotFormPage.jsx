import './UpdateSpotFormPage.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSpot } from '../../store/spots';
import { useNavigate } from 'react-router-dom';

const UpdateSpotFormPage = () => {
  const spot = useSelector((state) => state.spots.currentSpot);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [country, setCountry] = useState(spot.country);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [description, setDescription] = useState(spot.description);
  const [title, setTitle] = useState(spot.name);
  const [price, setPrice] = useState(spot.price);
  const [previewImage, setPreviewImage] = useState(spot.previewImage);

  const handleUpdateSpot = async (e) => {
    e.preventDefault();

    const payload = {
      id: spot.id,
      avgRating: spot.avgRating,
      address: address,
      city: city,
      state: state,
      country: country,
      name: title,
      description: description,
      price: price,
      preview_image: previewImage,
    };

    const updatedSpot = await dispatch(updateSpot(spot.id, payload));
    console.log(updatedSpot);

    if (updatedSpot) {
      navigate(`/spots/${updatedSpot.id}`);
    }
  };

  return (
    <div className="update-spot-page">
      <div className="update-form-start">
        <div className="update-form-header">Update Your Nest</div>
        <div className="update-tag-line">
          <span className="update-large-text">{`Where's youre nest located?`}</span>
          Guests will only get your exact address once they booked a reservation
        </div>
        <div className="update-data-entry">
          <form className="update-form" onSubmit={handleUpdateSpot}>
            <label>Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            ></input>
            <label>Street Address</label>
            <input
              type="text"
              value={address}
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            ></input>
            <div className="update-neighbors">
              <div className="stacked-update-input">
                <label>City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                ></input>
              </div>
              <div className="stacked-update-input">
                <label>State</label>
                <input
                  type="text"
                  value={state}
                  placeholder="State"
                  onChange={(e) => setState(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="update-description-entry">
              <div className="update-large-text">
                Describe your place to guests
              </div>
              Mention the best features of your space, any special amenities
              like fast wifi or parking, and what you love about the
              neighborhood.
            </div>
            <textarea
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please write at least 30 characters"
            ></textarea>
            <div className="update-large-text">
              Create a title for your nest
            </div>
            <div>
              {`Catch guest's attention with a title that highlights what makes your place special`}
            </div>
            <input
              type="text"
              value={title}
              placeholder="Name of your nest"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            <div className="update-large-text">
              Set a base price for your spot
            </div>
            <div>
              Competitive pricing can help your listing stand out and rank
              higher in search results
            </div>
            <div>
              {`$ `}
              <input
                type="number"
                value={price}
                placeholder="Price per night (USD)"
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>
            <div className="update-large-text">
              Update your spots preview image
            </div>
            <input
              type="text"
              value={previewImage}
              placeholder="Preview Image Url"
              onChange={(e) => setPreviewImage(e.target.value)}
            ></input>
            <div className="update-form-button">
              <button type="submit">Update your Nest</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSpotFormPage;
