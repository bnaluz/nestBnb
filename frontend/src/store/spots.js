import { csrfFetch } from './csrf';

//*VARIABLE TYPES
const LOAD = 'spots/LOAD';
const GET_DETAIL = 'spots/GET_DETAIL';
const ADD_SPOT = 'spots/ADD_SPOT';
const ADD_SPOT_IMAGES = 'spots/ADD_SPOT_IMAGES';

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

const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    spot,
  };
};

const addSpotImages = (spotId, images) => {
  return {
    type: ADD_SPOT_IMAGES,
    spotId,
    images,
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

export const createSpot = (payload) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const newSpot = await response.json();
    dispatch(addSpot(newSpot));
    return newSpot;
  }
};

export const createSpotImages =
  ({ spotId, url }) =>
  async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (response.ok) {
        const newImage = await response.json();
        dispatch(addSpotImages(spotId, [newImage]));
        return newImage;
      }
    } catch (error) {
      console.error('Error creating spot image:', error);
      throw error;
    }
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
    case ADD_SPOT: {
      const newSpot = action.spot;
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [newSpot.id]: newSpot,
        },
      };
    }
    case ADD_SPOT_IMAGES: {
      const { spotId, images } = action;
      const spot = state.allSpots[spotId];
      if (spot) {
        return {
          ...state,
          allSpots: {
            ...state.allSpots,
            [spotId]: {
              ...spot,
              SpotImages: [...(spot.SpotImages || []), ...images],
            },
          },
        };
      }
      return state;
    }

    default:
      return state;
  }
};

export default spotsReducer;
