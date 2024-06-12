import { csrfFetch } from './csrf';

//*VARIABLE TYPES
const GET_SPOT_REVIEWS = 'reviews/GET';

//*ACTIONS
const getSpotReviews = (reviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    reviews,
  };
};

//*THUNKYS
export const getReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  const reviews = await response.json();
  dispatch(getSpotReviews(reviews));
  return reviews;
};

const initialState = { reviews: {} };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOT_REVIEWS: {
      return {
        ...state,
        reviews: action.reviews,
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
