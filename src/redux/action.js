import spotifyApi from "../Spotify";
import history from "../history";

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
export const LOADING_START_CURRENTSONG = "LOADING_START_CURRENTSONG";
export const LOADING_SUCCESS_CURRENTSONG = "LOADING_SUCCESS_CURRENTSONG";
export const LOADING_FAILED_CURRENTSONG = "LOADING_FAILED_CURRENTSONG";
export const ADD_TOPARTISTS = "ADD_TOPARTISTS";

export function addTopArtists(artists) {
  console.log(artists);
  return {
    type: ADD_TOPARTISTS,
    data: artists,
  };
}

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

export function loadingSuccessCountryPlaylist(data, artistList) {
  return {
    type: LOADING_SUCCESS_COUNTRYPLAYLIST,
    data: data,
    topArtist: artistList,
  };
}

export function loadingFailedCountryPlaylist(error) {
  return {
    type: LOADING_FAILED_COUNTRYPLAYLIST,
    error: error,
  };
}

export function loadingStartCurrentSong() {
  return {
    type: LOADING_START_CURRENTSONG,
  };
}

export function loadingSuccessCurrentSong(data) {
  return {
    type: LOADING_SUCCESS_CURRENTSONG,
    data: data,
  };
}

export function loadingFailedCurrentSong(error) {
  return {
    type: LOADING_FAILED_CURRENTSONG,
    error: error,
  };
}

export function getUserThunk() {
  return async (dispatch) => {
    try {
      const user = await spotifyApi.getMe();
      dispatch(addUser(user));
    } catch (error) {
      dispatch(loadingFailedUser(error));
      history.push("/login");
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
      history.push("/login");
    }
  };
}

export function getTopArtistsThunk() {
  return async (dispatch) => {
    try {
      dispatch(loadingStartTopArtists());
      const options = {
        time_range: "long_term",
        limit: 50,
      };
      const result = await spotifyApi.getMyTopArtists(options);
      dispatch(loadingSuccessTopArtists(result.items));
    } catch (error) {
      console.log(error);
      dispatch(loadingFailedTopArtists(error));
      history.push("/login");
    }
  };
}

// const topArtists = useSelector((state) => state.data.topArtists);
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

      async function artistHelper(id) {
        console.log("GET ARTIST");
        return new Promise((resolve) => {
          spotifyApi.getArtist(id).then((artistInfo) => {
            if (artistInfo.images.length !== 0) {
              const name = artistInfo.name;
              const imageUrl = artistInfo.images[0].url;
              const popularity = artistInfo.popularity;
              const obj = {
                main: true,
                related: id,
                name: name,
                id: id,
                popularity: popularity,
                image: imageUrl,
                selected: false,
              };
              resolve(obj);
            }
          });
        });
      }

      async function parallel(array) {
        const promises = array.map((id) => artistHelper(id));
        const parallelResult = await Promise.all(promises);
        return parallelResult;
      }

      const nameList = [];
      const artistIDList = [];

      // list.push(test(artist));
      data.map(async (song) => {
        song.artists.forEach(async (artist) => {
          const name = artist.name;
          const id = artist.id;
          if (!nameList.includes(name)) {
            nameList.push(name);
            artistIDList.push(id);
          }
        });
      });

      const artistList = await parallel(artistIDList);
      artistList.sort((a, b) =>
        a.popularity > b.popularity ? -1 : b.popularity >= a.popularity ? 1 : 0
      );

      dispatch(
        loadingSuccessCountryPlaylist(
          data.slice(0, 20),
          artistList.slice(0, 12)
        )
      );
    } catch (error) {
      dispatch(loadingFailedCountryPlaylist(error));
      history.push("/login");
    }
  };
}

export function getCurrentSongThunk(song) {
  return async (dispatch) => {
    try {
      dispatch(loadingStartCurrentSong());
      const result = await spotifyApi.getAudioFeaturesForTrack(song.id);
      dispatch(
        loadingSuccessCurrentSong({
          info: {
            name: song.name,
            img: song.img,
            id: song.id,
            artists: song.artists,
          },
          features: {
            acousticness: result.acousticness,
            danceability: result.danceability,
            energy: result.energy,
            instrumentalness: result.instrumentalness,
            valence: result.valence,
          },
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(loadingFailedCurrentSong(error));
      history.push("/login");
    }
  };
}
