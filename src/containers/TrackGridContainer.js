import { useCallback } from "react";
import TrackGrid from "../components/TrackGrid";
import { useDispatch, useSelector } from "react-redux";
import { getTopTracksThunk, getCountryPlaylistThunk } from "../redux/action";

export default function TrackGridContainer() {
  const dispatch = useDispatch();

  const topTracks = useSelector((state) => state.data.topTracks);
  const countryPlaylist = useSelector((state) => state.data.countryPlaylist);
  const user = useSelector((state) => state.user);

  const getTopTracks = useCallback(
    (countryCode) => {
      dispatch(getTopTracksThunk(countryCode));
    },
    [dispatch]
  );

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
      countryPlaylist={countryPlaylist.content}
      getTopTracks={getTopTracks}
      getCountryPlaylist={getCountryPlaylist}
      user={user}
    ></TrackGrid>
  );
}
