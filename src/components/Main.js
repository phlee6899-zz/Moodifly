import { useSelector } from "react-redux";
import history from "../history";
import { useEffect } from "react";
import TrackGridContainer from "../containers/TrackGridContainer";
import AverageChartContainer from "../containers/AverageChartContainer";
import "./Main.css";
import spotifyApi from "../Spotify";
import Navbar from "./Navbar";

export default function Main() {
  const token = useSelector((state) => {
    return state.token;
  });

  useEffect(() => {
    if (token === "") {
      history.push("/login");
    } else {
      spotifyApi.setAccessToken(token.token);
    }
  }, []);

  return (
    <>
      {token && (
        <div className="mainContainer">
          <Navbar></Navbar>
          <div className="contentContainer">
            <TrackGridContainer></TrackGridContainer>
            <AverageChartContainer></AverageChartContainer>
          </div>
        </div>
      )}
    </>
  );
}
