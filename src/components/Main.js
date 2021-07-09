import { useSelector } from "react-redux";
import history from "../history";
import { useEffect, useState } from "react";
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

  const localTopArtist = useSelector((state) => {
    return state.data.topArtists;
  });

  // const reduxTrack = useSelector((state) => state.data.topTracks);
  // const reduxArtist = useSelector((state) => state.data.topArtists);

  spotifyApi.setAccessToken(token.token);

  const [topArtist, setTopArtist] = useState([]);
  const [topTrack, setTopTrack] = useState([]);
  const [isView, setIsView] = useState(false);

  async function setTopInfo() {
    spotifyApi.setAccessToken(token.token);
    const artistOptions = {
      time_range: "long_term",
      limit: 20,
    };
    await spotifyApi
      .getMyTopArtists(artistOptions)
      .then((result) => {
        if (result.items.length > 0) {
          setTopArtist(result.items);
        } else {
          setTopArtist([]);
        }
      })
      .catch((error) => {
        console.log("ERROR");
        console.log(error);
      });

    const options = {
      time_range: "long_term",
      limit: 20,
    };

    await spotifyApi.getMyTopTracks(options).then((result) => {
      if (result.items.length > 0) {
        setTopTrack(result.items);
      } else {
        setTopTrack([]);
      }
    });
    setIsView(true);
  }

  useEffect(() => {
    if (token !== "") {
      setTopInfo();
    }
    // setTopInfo();
  }, [token]);

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
        isView &&
        topTrack &&
        topArtist &&
        ((topTrack.length == 0 &&
          topArtist.length == 0 &&
          localTopArtist.content &&
          localTopArtist.content.length == 5) ||
          (topTrack.length >= 2 && topArtist.length >= 3)) && (
          <div className="mainContainer">
            <Navbar></Navbar>
            <div className="contentContainer">
              <TrackGridContainer></TrackGridContainer>
              <AverageChartContainer></AverageChartContainer>
            </div>
          </div>
        )}
      {token &&
        isView &&
        topTrack &&
        topArtist &&
        ((topTrack.length == 0 &&
          topArtist.length == 0 &&
          localTopArtist.content === undefined) ||
          (!(topTrack.length == 0 && topArtist.length == 0) &&
            !(topTrack.length >= 2 && topArtist.length >= 3))) && (
          <div className="mainContainer">
            <div className="pickContainer">
              <NewSelectionContainer></NewSelectionContainer>
            </div>
          </div>
        )}
    </>
  );
}
