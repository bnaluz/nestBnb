import { csrfFetch } from './csrf';
import { getSpotDetail } from './spots';

//*VARIABLE TYPES
const GET_SPOT_REVIEWS = 'reviews/GET';
const GET_USER_REVIEWS = 'reviews/GET_USERS';
const ADD_REVIEW = 'reviews/ADD';

//*ACTIONS
const getSpotReviews = (reviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    reviews,
  };
};

const getUserReviews = (userReviews) => {
  return {
    type: GET_USER_REVIEWS,
    userReviews,
  };
};

const addNewReview = (newReview) => {
  return {
    type: ADD_REVIEW,
    newReview,
  };
};

//*THUNKYS
export const getReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  const reviews = await response.json();
  dispatch(getSpotReviews(reviews));
  return reviews;
};

export const getCurrentUserReviews = () => async (dispatch) => {
  const response = await csrfFetch('/api/reviews/current');
  const userReviews = await response.json();
  dispatch(getUserReviews(userReviews));
  return userReviews;
};

export const postSpotReview = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${payload.spot_Id}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const newReview = await response.json();
  dispatch(addNewReview(newReview));
  await dispatch(getReviews(payload.spot_Id));
  await dispatch(getSpotDetail(payload.spot_Id));
  return newReview;
};

const initialState = { reviews: {}, currentUserReviews: {} };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOT_REVIEWS: {
      return {
        ...state,
        reviews: action.reviews,
      };
    }
    case GET_USER_REVIEWS: {
      const reviewData = action.userReviews;
      return {
        ...state,
        currentUserReviews: {
          ...reviewData,
        },
      };
    }
    case ADD_REVIEW: {
      const newReview = action.newReview;
      return {
        ...state,
        reviews: {
          ...state.reviews.Reviews,
          [newReview.id]: newReview,
        },
        currentUserReviews: {
          ...state.currentUserReviews,
          [newReview.id]: newReview,
        },
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
