import { useCallback } from "react";
import TrackGrid from "../components/MainPage/TrackGrid";
import { useDispatch, useSelector } from "react-redux";
import {
  getTopTracksThunk,
  getCountryPlaylistThunk,
  getTopArtistsThunk,
} from "../redux/action";
import spotifyApi from "../Spotify";

export default function TrackGridContainer() {
  const dispatch = useDispatch();

  const topTracks = useSelector((state) => state.data.topTracks);
  const topArtists = useSelector((state) => state.data.topArtists);
  const countryPlaylist = useSelector((state) => state.data.countryPlaylist);
  const user = useSelector((state) => state.user);

  const token = useSelector((state) => {
    return state.token;
  });

  spotifyApi.setAccessToken(token.token);

  const getTopTracks = useCallback(
    (countryCode) => {
      dispatch(getTopTracksThunk(countryCode));
    },
    [dispatch]
  );

  const getTopArtists = useCallback(() => {
    dispatch(getTopArtistsThunk());
  }, [dispatch]);

  const getCountryPlaylist = useCallback(
    (countryCode) => {
      dispatch(getCountryPlaylistThunk(countryCode));
    },
    [dispatch]
  );

  return (
    <TrackGrid
      topTrackLoading={topTracks.loading}
      countryPlaylistLoading={countryPlaylist.loading}
      topTracks={topTracks.content}
      topArtists={topArtists.content}
      countryPlaylist={countryPlaylist.content}
      getTopTracks={getTopTracks}
      getTopArtists={getTopArtists}
      getCountryPlaylist={getCountryPlaylist}
      user={user}
    ></TrackGrid>
  );
}
