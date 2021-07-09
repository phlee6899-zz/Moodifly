import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCountryPlaylistThunk } from "../redux/action";
import spotifyApi from "../Spotify";
import NewSelection from "../components/NewSelection";

export default function NewSelectionContainer() {
  const dispatch = useDispatch();

  const token = useSelector((state) => {
    return state.token;
  });

  spotifyApi.setAccessToken(token.token);

  const countryPlaylist = useSelector((state) => state.data.countryPlaylist);

  const user = useSelector((state) => state.user);

  const getCountryPlaylist = useCallback(
    (countryCode) => {
      dispatch(getCountryPlaylistThunk(countryCode));
    },
    [dispatch]
  );

  return (
    <NewSelection
      countryPlaylistLoading={countryPlaylist.loading}
      countryPlaylist={countryPlaylist}
      getCountryPlaylist={getCountryPlaylist}
      user={user}
    ></NewSelection>
  );
}
