import { useSelector } from "react-redux";
import history from "../history";
import { useEffect } from "react";
import TrackGridContainer from "../containers/TrackGridContainer";
import AverageChartContainer from "../containers/AverageChartContainer";
import "./Main.css";
import spotifyApi from "../Spotify";
import Navbar from "./Navbar";
import NewSelectionContainer from "../containers/NewSelectionContainer";

export default function Main() {
  const token = useSelector((state) => {
    return state.token;
  });
  const topTracks = useSelector((state) => state.data.topTracks.content);
  const topArtists = useSelector((state) => state.data.topArtists.content);

  useEffect(() => {
    if (token === "") {
      history.push("/login");
    } else {
      spotifyApi.setAccessToken(token.token);
    }
  }, []);

  return (
    <>
      {token &&
        topTracks &&
        topArtists &&
        topTracks.length >= 2 &&
        topArtists.length >= 3 && (
          <div className="mainContainer">
            <Navbar></Navbar>
            <div className="contentContainer">
              <TrackGridContainer></TrackGridContainer>
              <AverageChartContainer></AverageChartContainer>
            </div>
          </div>
        )}
      {/* {token &&
        (!topTracks ||
          !topArtists ||
          !(topTracks.length >= 2 && topArtists.length >= 3)) && (
          <div className="mainContainer">
            <div className="pickContainer">
              <NewSelectionContainer></NewSelectionContainer>
            </div>
          </div>
        )} */}
    </>
  );
}
