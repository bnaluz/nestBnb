import { csrfFetch } from './csrf';

//*VARIABLE TYPES
const LOAD = 'spots/LOAD';

//*ACTIONS
const loadSpots = (spots) => {
  return {
    type: LOAD,
    spots,
  };
};

//*THUNKYS
export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');

  const spots = await response.json();
  console.log(spots);
  dispatch(loadSpots(spots));
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
    default:
      return state;
  }
};

export default spotsReducer;
