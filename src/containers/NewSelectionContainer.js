// import { useCallback } from "react";
// import TrackGrid from "../components/TrackGrid";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { getCountryPlaylistThunk } from "../redux/action";
// import spotifyApi from "../Spotify";
// import NewSelection from "../components/NewSelection";

// export default function NewSelectionContainer() {
//   const dispatch = useDispatch();

//   const countryPlaylist = useSelector((state) => state.data.countryPlaylist);
//   const user = useSelector((state) => state.user);

//   const token = useSelector((state) => {
//     return state.token;
//   });

//   spotifyApi.setAccessToken(token.token);

//   const getCountryPlaylist = useCallback(
//     (countryCode) => {
//       dispatch(getCountryPlaylistThunk(countryCode));
//     },
//     [dispatch]
//   );

//   return (
//     <NewSelection
//       countryPlaylistLoading={countryPlaylist.loading}
//       countryPlaylist={countryPlaylist.content}
//       getCountryPlaylist={getCountryPlaylist}
//       user={user}
//     ></NewSelection>
//   );
// }
