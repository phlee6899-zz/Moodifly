import {
  LOADING_START_CURRENTSONG,
  LOADING_SUCCESS_CURRENTSONG,
  LOADING_FAILED_CURRENTSONG,
} from "../action";

const initState = {
  info: {},
  features: {},
};

export default function currentSongReducer(previousState = initState, action) {
  if (action.type === LOADING_START_CURRENTSONG) {
    return { ...previousState, loading: true };
  } else if (action.type === LOADING_SUCCESS_CURRENTSONG) {
    return {
      ...previousState,
      info: action.data.info,
      features: action.data.features,
      loading: false,
    };
  } else if (action.type === LOADING_FAILED_CURRENTSONG) {
    return {
      ...previousState,
      loading: false,
      error: action.error,
    };
  }
  return previousState;
}
