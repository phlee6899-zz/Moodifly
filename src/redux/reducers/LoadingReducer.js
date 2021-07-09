import {
  LOADING_START_TOPTRACKS,
  LOADING_SUCCESS_TOPTRACKS,
  LOADING_FAILED_TOPTRACKS,
  LOADING_START_TOPARTISTS,
  LOADING_SUCCESS_TOPARTISTS,
  LOADING_FAILED_TOPARTISTS,
  LOADING_START_TRACKANALYTICS,
  LOADING_SUCCESS_TRACKANALYTICS,
  LOADING_FAILED_TRACKANALYTICS,
  LOADING_START_COUNTRYPLAYLIST,
  LOADING_SUCCESS_COUNTRYPLAYLIST,
  LOADING_FAILED_COUNTRYPLAYLIST,
  ADD_TOPARTISTS,
} from "../action";

const initState = {
  topTracks: {},
  topArtists: {},
  countryPlaylist: {},
  trackAnalytics: {},
};

export default function loadingReducer(previousState = initState, action) {
  if (action.type === LOADING_START_TOPTRACKS) {
    return { ...previousState, topTracks: { loading: true } };
  } else if (action.type === LOADING_START_TOPARTISTS) {
    return { ...previousState, topArtists: { loading: true } };
  } else if (action.type === LOADING_START_TRACKANALYTICS) {
    return { ...previousState, trackAnalytics: { loading: true } };
  } else if (action.type === LOADING_START_COUNTRYPLAYLIST) {
    return { ...previousState, countryPlaylist: { loading: true } };
  } else if (action.type === LOADING_SUCCESS_TOPTRACKS) {
    return {
      ...previousState,
      topTracks: { loading: false, content: action.data },
    };
  } else if (action.type === LOADING_SUCCESS_TOPARTISTS) {
    return {
      ...previousState,
      topArtists: { loading: false, content: action.data },
    };
  } else if (action.type === ADD_TOPARTISTS) {
    return {
      ...previousState,
      topArtists: { loading: false, content: action.data },
    };
  } else if (action.type === LOADING_SUCCESS_TRACKANALYTICS) {
    return {
      ...previousState,
      trackAnalytics: { loading: false, content: action.data },
    };
  } else if (action.type === LOADING_SUCCESS_COUNTRYPLAYLIST) {
    return {
      ...previousState,
      countryPlaylist: {
        loading: false,
        content: action.data,
        topArtist: action.topArtist,
      },
    };
  } else if (action.type === LOADING_FAILED_TOPTRACKS) {
    return {
      ...previousState,
      topTracks: { loading: false, error: action.error },
    };
  } else if (action.type === LOADING_FAILED_TOPARTISTS) {
    return {
      ...previousState,
      topArtists: { loading: false, error: action.error },
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
