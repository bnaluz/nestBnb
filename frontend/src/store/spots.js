import { csrfFetch } from './csrf';

//*VARIABLE TYPES
const LOAD = 'spots/LOAD';
const GET_DETAIL = 'spots/GET_DETAIL';

//*ACTIONS
const loadSpots = (spots) => {
  return {
    type: LOAD,
    spots,
  };
};

const spotDetails = (spotDetails) => {
  return {
    type: GET_DETAIL,
    spotDetails,
  };
};

//*THUNKYS
export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');

  const spots = await response.json();
  console.log(spots);
  dispatch(loadSpots(spots));
};

export const getSpotDetail = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  const spotDetail = await response.json();
  dispatch(spotDetails(spotDetail));
};

//*INITIAL STATE && REDUCER

const initialState = { allSpots: {}, currentSpot: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const allSpots = {};
      action.spots.Spots.forEach((spot) => {
        allSpots[spot.id] = spot;
      });
      return {
        ...state,
        allSpots: { ...allSpots },
      };
    }
    case GET_DETAIL: {
      const spot = action.spotDetails;
      return { ...state, currentSpot: spot };
    }

    default:
      return state;
  }
};

export default spotsReducer;
