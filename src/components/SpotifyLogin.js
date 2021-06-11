import history from "../history";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToken, getUserThunk } from "../redux/action";
import spotifyApi from "../Spotify";

export default function SpotifyLogin() {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = hashUrl().access_token;
    spotifyApi.setAccessToken(accessToken);
    dispatch(addToken(accessToken));
    dispatch(getUserThunk());
    if (accessToken) {
      history.push("/");
    } else {
      history.push("/login");
    }
  }, []);

  const hashUrl = () => {
    return window.location.hash
      .substring(1)
      .split("&")
      .reduce((initial, item) => {
        if (item) {
          let parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
  };

  return <div></div>;
}
