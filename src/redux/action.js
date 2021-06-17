import spotifyApi from "../Spotify";

export const ADD_TOKEN = "ADD_TOKEN";
export const ADD_USER = "ADD_USER";
export const LOADING_FAILED_USER = "LOADING_FAILED_USER";
export const LOADING_START_TOPTRACKS = "LOADING_START_TOPTRACKS";
export const LOADING_SUCCESS_TOPTRACKS = "LOADING_SUCCESS_TOPTRACKS";
export const LOADING_FAILED_TOPTRACKS = "LOADING_FAILED_TOPTRACKS";
export const LOADING_START_TOPARTISTS = "LOADING_START_TOPARTISTS";
export const LOADING_SUCCESS_TOPARTISTS = "LOADING_SUCCESS_TOPARTISTS";
export const LOADING_FAILED_TOPARTISTS = "LOADING_FAILED_TOPARTISTS";
export const LOADING_START_TRACKANALYTICS = "LOADING_START_TRACKANALYTICS";
export const LOADING_SUCCESS_TRACKANALYTICS = "LOADING_SUCCESS_TRACKANALYTICS";
export const LOADING_FAILED_TRACKANALYTICS = "LOADING_FAILED_TRACKANALYTICS";
export const LOADING_START_COUNTRYPLAYLIST = "LOADING_START_COUNTRYPLAYLIST";
export const LOADING_SUCCESS_COUNTRYPLAYLIST =
  "LOADING_SUCCESS_COUNTRYPLAYLIST";
export const LOADING_FAILED_COUNTRYPLAYLIST = "LOADING_FAILED_COUNTRYPLAYLIST";

export function addToken(token) {
  return {
    type: ADD_TOKEN,
    token: token,
  };
}

export function addUser(user) {
  return {
    type: ADD_USER,
    user: user,
  };
}

export function loadingFailedUser(error) {
  return {
    type: LOADING_FAILED_USER,
    error: error,
  };
}

export function loadingStartTopTracks() {
  return {
    type: LOADING_START_TOPTRACKS,
  };
}

export function loadingSuccessTopTracks(data) {
  return {
    type: LOADING_SUCCESS_TOPTRACKS,
    data: data,
  };
}

export function loadingFailedTopTracks(error) {
  return {
    type: LOADING_FAILED_TOPTRACKS,
    error: error,
  };
}

export function loadingStartTopArtists() {
  return {
    type: LOADING_START_TOPARTISTS,
  };
}

export function loadingSuccessTopArtists(data) {
  return {
    type: LOADING_SUCCESS_TOPARTISTS,
    data: data,
  };
}

export function loadingFailedTopArtists(error) {
  return {
    type: LOADING_FAILED_TOPARTISTS,
    error: error,
  };
}

export function loadingStartTrackAnalytics() {
  return {
    type: LOADING_START_TRACKANALYTICS,
  };
}

export function loadingSuccessTrackAnalytics(data) {
  return {
    type: LOADING_SUCCESS_TRACKANALYTICS,
    data: data,
  };
}

export function loadingFailedTrackAnalytics(error) {
  return {
    type: LOADING_FAILED_TRACKANALYTICS,
    error: error,
  };
}

export function loadingStartCountryPlaylist() {
  return {
    type: LOADING_START_COUNTRYPLAYLIST,
  };
}

export function loadingSuccessCountryPlaylist(data) {
  return {
    type: LOADING_SUCCESS_COUNTRYPLAYLIST,
    data: data,
  };
}

export function loadingFailedCountryPlaylist(error) {
  return {
    type: LOADING_FAILED_COUNTRYPLAYLIST,
    error: error,
  };
}

function delayFunction(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function getUserThunk() {
  return async (dispatch) => {
    try {
      const user = await spotifyApi.getMe();
      dispatch(addUser(user));
    } catch (error) {
      dispatch(loadingFailedUser(error));
    }
  };
}

export function getTopTracksThunk(countryCode) {
  return async (dispatch) => {
    try {
      dispatch(loadingStartTopTracks());
      dispatch(loadingStartTrackAnalytics());
      // await delayFunction(4000);
      const options = {
        time_range: "long_term",
        limit: 50,
      };
      const result = await spotifyApi.getMyTopTracks(options);

      if (result.total === 0) {
        dispatch(loadingSuccessTopTracks([]));
      } else {
        const trackIDs = [];
        result.items.forEach((track) => {
          trackIDs.push(track.id);
        });

        const tracks = await spotifyApi.getTracks(trackIDs, {
          market: countryCode,
        });
        const data = [];

        tracks.tracks.forEach((track) => {
          if (track.preview_url) {
            data.push(track);
          }
        });

        if (data.length < 10) {
          dispatch(loadingSuccessTopTracks([]));
          dispatch(loadingSuccessTrackAnalytics([]));
        } else {
          dispatch(loadingSuccessTopTracks(data.slice(0, 20)));
          const analytics = await spotifyApi.getAudioFeaturesForTracks(
            trackIDs
          );
          dispatch(loadingSuccessTrackAnalytics(analytics.audio_features));
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(loadingFailedTopTracks(error));
      dispatch(loadingFailedTrackAnalytics(error));
    }
  };
}

export function getTopArtistsThunk() {
  return async (dispatch) => {
    try {
      dispatch(loadingStartTopArtists());
      // await delayFunction(4000);
      const options = {
        time_range: "long_term",
        limit: 50,
      };
      const result = await spotifyApi.getMyTopArtists(options);
      dispatch(loadingSuccessTopArtists(result.items));
    } catch (error) {
      console.log(error);
      dispatch(loadingFailedTopArtists(error));
    }
  };
}

export function getCountryPlaylistThunk(countryCode) {
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
    type: "region",
  });

  const fullCountry = regionNamesInEnglish.of(countryCode);

  return async (dispatch) => {
    try {
      dispatch(loadingStartCountryPlaylist());
      const options = {
        market: countryCode,
        limit: 1,
      };
      const playlist = await spotifyApi.search(
        `Top Songs - ${fullCountry}`,
        ["playlist"],
        options
      );

      const playlistId = playlist.playlists.items[0].id;

      const optionsPlaylist = {
        market: countryCode,
        fields:
          "items(track(id,name,external_urls, artists, album(images), preview_url))",
        limit: 100,
      };

      const result = await spotifyApi.getPlaylistTracks(
        playlistId,
        optionsPlaylist
      );

      console.log(result);
      const trackIDs = [];
      result.items.forEach((track) => {
        trackIDs.push(track.track.id);
      });

      const tracks = await spotifyApi.getTracks(trackIDs, {
        market: countryCode,
      });
      const data = [];

      tracks.tracks.forEach((track) => {
        if (track.preview_url) {
          data.push(track);
        }
      });

      dispatch(loadingSuccessCountryPlaylist(data.slice(0, 20)));
    } catch (error) {
      dispatch(loadingFailedCountryPlaylist(error));
    }
  };
}
