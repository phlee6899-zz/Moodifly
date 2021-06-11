import {
  LOADING_START_TOPTRACKS,
  LOADING_SUCCESS_TOPTRACKS,
  LOADING_FAILED_TOPTRACKS,
  LOADING_START_TRACKANALYTICS,
  LOADING_SUCCESS_TRACKANALYTICS,
  LOADING_FAILED_TRACKANALYTICS,
  LOADING_START_COUNTRYPLAYLIST,
  LOADING_SUCCESS_COUNTRYPLAYLIST,
  LOADING_FAILED_COUNTRYPLAYLIST,
} from "../action";

const initState = {
  topTracks: {},
  countryPlaylist: {},
  trackAnalytics: {},
};

export default function loadingReducer(previousState = initState, action) {
  if (action.type === LOADING_START_TOPTRACKS) {
    return { ...previousState, topTracks: { loading: true } };
  } else if (action.type === LOADING_START_TRACKANALYTICS) {
    return { ...previousState, trackAnalytics: { loading: true } };
  } else if (action.type === LOADING_START_COUNTRYPLAYLIST) {
    return { ...previousState, countryPlaylist: { loading: true } };
  } else if (action.type === LOADING_SUCCESS_TOPTRACKS) {
    return {
      ...previousState,
      topTracks: { loading: false, content: action.data },
    };
  } else if (action.type === LOADING_SUCCESS_TRACKANALYTICS) {
    return {
      ...previousState,
      trackAnalytics: { loading: false, content: action.data },
    };
  } else if (action.type === LOADING_SUCCESS_COUNTRYPLAYLIST) {
    return {
      ...previousState,
      countryPlaylist: { loading: false, content: action.data },
    };
  } else if (action.type === LOADING_FAILED_TOPTRACKS) {
    return {
      ...previousState,
      topTracks: { loading: false, error: action.error },
    };
  } else if (action.type === LOADING_FAILED_TRACKANALYTICS) {
    return {
      ...previousState,
      trackAnalytics: { loading: false, error: action.error },
    };
  } else if (action.type === LOADING_FAILED_COUNTRYPLAYLIST) {
    return {
      ...previousState,
      countryPlaylist: { loading: false, error: action.error },
    };
  }
  return previousState;
}
