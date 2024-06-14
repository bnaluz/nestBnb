import { useDispatch, useSelector } from 'react-redux';
import './CreateSpotPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSpot, createSpotImages } from '../../store/spots';

const CreateSpotPage = () => {
  const currentUser = useSelector((state) => state.session.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});

  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [imageUrl3, setImageUrl3] = useState('');
  const [imageUrl4, setImageUrl4] = useState('');

  const validateImageUrl = (url) => {
    return (
      url &&
      (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg'))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateImageUrl(previewImage)) {
      newErrors.preview_image =
        'Preview Image URL must end in .png, .jpg, or .jpeg';
    }
    if (imageUrl1 && !validateImageUrl(imageUrl1)) {
      newErrors.imageUrl1 = 'Image URL 1 must end in .png, .jpg, or .jpeg';
    }
    if (imageUrl2 && !validateImageUrl(imageUrl2)) {
      newErrors.imageUrl2 = 'Image URL 2 must end in .png, .jpg, or .jpeg';
    }
    if (imageUrl3 && !validateImageUrl(imageUrl3)) {
      newErrors.imageUrl3 = 'Image URL 3 must end in .png, .jpg, or .jpeg';
    }
    if (imageUrl4 && !validateImageUrl(imageUrl4)) {
      newErrors.imageUrl4 = 'Image URL 4 must end in .png, .jpg, or .jpeg';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }

    const payload = {
      ownerId: currentUser.id,
      address: address,
      city: city,
      state: state,
      country: country,
      name: title,
      description: description,
      price: price,
      preview_image: previewImage,
    };

    try {
      let newSpot = await dispatch(createSpot(payload));
      const spotId = newSpot.id;
      const imageUrls = [imageUrl1, imageUrl2, imageUrl3, imageUrl4].filter(
        Boolean
      );

      for (const url of imageUrls) {
        await dispatch(createSpotImages({ spotId, url }));
      }

      navigate(`/spots/${spotId}`);
    } catch (error) {
      if (error.json) {
        const data = await error.json();
        if (data?.errors) setErrors(data.errors);
      }
    }
  };

  return (
    <div className="create-container">
      <div className="form-start">
        <div className="form-header">CREATE A NEW NEST</div>
        <div className="tag-line">
          <span className="large-text">{`Where's your place located?`}</span>
          Guests will only get your exact address once they booked a
          reservation.
        </div>
        <div className="data-entry">
          <form className="create-form" onSubmit={handleSubmit}>
            <label>Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            ></input>
            {errors.country && (
              <p className="error-message">{errors.country}</p>
            )}
            <label>Street Address</label>
            <input
              type="text"
              value={address}
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            ></input>
            {errors.address && (
              <p className="error-message">{errors.address}</p>
            )}
            <div className="neighbors">
              <div className="stacked-label-input">
                <label>City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                ></input>
                {errors.city && <p className="error-message">{errors.city}</p>}
              </div>
              <div className="stacked-label-input">
                <label>State</label>
                <input
                  type="text"
                  value={state}
                  placeholder="State"
                  onChange={(e) => setState(e.target.value)}
                ></input>
                {errors.state && (
                  <p className="error-message">{errors.state}</p>
                )}
              </div>
            </div>
            <div className="description-entry">
              <div className="large-text">Describe your place to guests</div>
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
            {errors.description && (
              <p className="error-message">{errors.description}</p>
            )}
            <div className="large-text">Create a title for your spot</div>
            <div>
              {`Catch guest's attention with a spot title that highlights what
              makes your place special`}
            </div>
            <input
              type="text"
              value={title}
              placeholder="Name of your nest"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            {errors.name && <p className="error-message">{errors.name}</p>}
            <div className="large-text">Set a base price for your spot</div>
            <div>
              Competitive pricing can help your listing stand out and rank
              higher in search results
            </div>
            <div>
              ${' '}
              <input
                type="number"
                value={price}
                placeholder="Price per night (USD)"
                onChange={(e) => setPrice(e.target.value)}
              ></input>
              {errors.price && <p className="error-message">{errors.price}</p>}
            </div>
            <div className="large-text">Liven up your spot with photos</div>
            <div>Submit a link to at least one photo to publish your spot</div>
            <input
              type="text"
              value={previewImage}
              placeholder="Preview Image Url"
              onChange={(e) => setPreviewImage(e.target.value)}
            ></input>
            {errors.preview_image && (
              <p className="error-message">{errors.preview_image}</p>
            )}
            <input
              placeholder="Image URL"
              value={imageUrl1}
              onChange={(e) => setImageUrl1(e.target.value)}
            ></input>
            {errors.imageUrl1 && (
              <p className="error-message">{errors.imageUrl1}</p>
            )}
            <input
              placeholder="Image URL"
              value={imageUrl2}
              onChange={(e) => setImageUrl2(e.target.value)}
            ></input>
            {errors.imageUrl2 && (
              <p className="error-message">{errors.imageUrl2}</p>
            )}
            <input
              placeholder="Image URL"
              value={imageUrl3}
              onChange={(e) => setImageUrl3(e.target.value)}
            ></input>
            {errors.imageUrl3 && (
              <p className="error-message">{errors.imageUrl3}</p>
            )}
            <input
              placeholder="Image URL"
              value={imageUrl4}
              onChange={(e) => setImageUrl4(e.target.value)}
            ></input>
            {errors.imageUrl4 && (
              <p className="error-message">{errors.imageUrl4}</p>
            )}
            <div className="create-button">
              <button type="submit">Create your Nest</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSpotPage;
