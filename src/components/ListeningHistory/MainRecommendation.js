import spotifyApi from "../../Spotify";
import history from "../../history";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import Slider, { Range } from "rc-slider";
import NavBar from "../NavBar/Navbar";
import "rc-slider/assets/index.css";
import "./MainRecommendation.css";
import ScrollText from "react-scroll-text";

export default function MainRecommendation({
  topTrackLoading,
  topArtistsLoading,
}) {
  const [features, setFeatures] = useState({});

  const [acousticness, setAcousticness] = useState([0, 100]);
  const [danceability, setDanceability] = useState([0, 100]);
  const [energy, setEnergy] = useState([0, 100]);
  const [valence, setValence] = useState([0, 100]);
  const [popularity, setPopularity] = useState([0, 100]);

  const topTracks = useSelector((state) => state.data.topTracks.content);
  const topArtists = useSelector((state) => state.data.topArtists.content);
  const user = useSelector((state) => state.user.user);

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

  useEffect(() => {
    getRecommendation();
  }, []);

  const [current, setCurrent] = useState({
    name: "",
    img: "",
    id: "",
    uri: "",
    preview: "",
    fullLink: "",
    artists: [],
    playing: false,
  });

  const resetSlider = () => {
    setAcousticness([0, 100]);
    setDanceability([0, 100]);
    setEnergy([0, 100]);
    setValence([0, 100]);
    setPopularity([0, 100]);
  };

  const formatArtistName = () => {
    return current.artists.map((artist) => artist.name).join(", ");
  };

  const getRecommendation = () => {
    if (
      !topArtists ||
      !topTracks ||
      topArtists.length === 0 ||
      topTracks === 0
    ) {
      return;
    }
    if (current.id && current.preview) {
      setCurrent({ ...current, playing: false });
      document.getElementById(current.id).muted = true;
      document.getElementById(current.id).pause();
    }

    let seedArtist = [];
    let seedTrack = [];

    if (topTracks.length >= 2 && topArtists.length >= 3) {
      seedTrack = topTracks.slice(0, 2).map((track) => track.id);
      seedArtist = topArtists.slice(0, 3).map((artist) => artist.id);
    } else {
      if (topArtists.length > topTracks.length) {
        seedArtist = topArtists.slice(0, 5).map((artist) => artist.id);
      } else {
        seedTrack = topTracks.slice(0, 5).map((track) => track.id);
      }
    }

    spotifyApi
      .getRecommendations({
        market: user.country,
        seed_artists: seedArtist,
        seed_tracks: seedTrack,
        limit: 1,
        min_acousticness: acousticness[0] / 100,
        max_acousticness: acousticness[1] / 100,
        min_danceability: danceability[0] / 100,
        max_danceability: danceability[1] / 100,
        min_energy: energy[0] / 100,
        max_energy: energy[1] / 100,
        min_valence: valence[0] / 100,
        max_valence: valence[1] / 100,
        min_popularity: popularity[0],
        max_popularity: popularity[1],
      })
      .then((song) => {
        if (song.tracks.length === 0) {
          alert(
            "No recommendations for your preferences! Try expanding your search options."
          );
          resetSlider();
          return;
        } else {
          spotifyApi.getTrack(song.tracks[0].id).then((info) =>
            setCurrent({
              name: song.tracks[0].name,
              img: song.tracks[0].album.images[0].url,
              artists: song.tracks[0].artists,
              uri: song.tracks[0].uri,
              fullLink: song.tracks[0].external_urls.spotify,
              id: song.tracks[0].id,
              preview: info.preview_url,
              playing: false,
            })
          );
          spotifyApi
            .getAudioFeaturesForTrack(song.tracks[0].id)
            .then((feature) => {
              spotifyApi.getTrack(song.tracks[0].id).then((track) => {
                setFeatures({ ...feature, popularity: track.popularity });
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        history.push("/login");
      });
  };

  const saveTrack = () => {
    // console.log("saved");

    try {
      spotifyApi.addToMySavedTracks({ ids: [current.id] });
    } catch (error) {
      history.push("/login");
    }
    getRecommendation();
  };

  const handleClick = () => {
    if (
      !document.getElementById(current.id).paused ||
      document.getElementById(current.id).currentTime
    ) {
      setCurrent({
        name: current.name,
        img: current.img,
        id: current.id,
        uri: current.uri,
        preview: current.preview,
        fullLink: current.fullLink,
        artists: current.artists,
        playing: false,
      });

      document.getElementById(current.id).muted = true;
      document.getElementById(current.id).pause();
      document.getElementById(current.id).currentTime = 0;
    } else {
      setCurrent({
        name: current.name,
        img: current.img,
        id: current.id,
        uri: current.uri,
        preview: current.preview,
        fullLink: current.fullLink,
        artists: current.artists,
        playing: true,
      });
      document.getElementById(current.id).src = current.preview;
      document.getElementById(current.id).muted = false;
      document.getElementById(current.id).play();
    }
  };

  const marks = {
    0: {
      style: {
        color: "white",
      },
      label: <strong>0</strong>,
    },
    50: {
      style: {
        color: "white",
      },
      label: <strong>50</strong>,
    },
    100: {
      style: {
        color: "white",
      },
      label: <strong>100</strong>,
    },
  };

  const dataContent = {
    labels: [
      "Acousticness",
      "Danceability",
      "Energy",
      "Positiveness",
      "Popularity",
    ],
    datasets: [
      {
        // label: "Current Track's Track Analysis",
        data: [
          features.acousticness,
          features.danceability,
          features.energy,
          features.valence,
          features.popularity / 100,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
        fill: true,
        borderWidth: 3,
      },
    ],
  };

  const option = {
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            size: 25,
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          color: "#FFF",
        },
        ticks: {
          beginAtZero: true,
          max: 5,
          min: 0,
          stepSize: 0.5,
          maxTicksLimit: 3,
          color: "black",
          backdropColor: "white",
          font: {
            size: 10,
            weight: 900,
          },
        },
        grid: {
          color: "#FFF",
        },
        pointLabels: {
          color: "#FFF",
          font: {
            size: 15,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="mcontainer">
      {/* Header */}
      <NavBar />
      {current.name && (
        <div className="mainContainer">
          {/* currentSongContainer */}
          <div className="currentSongContainer">
            <div className="songTitle">
              <ScrollText speed={80}>{current.name}</ScrollText>
            </div>
            <div className="artistName">
              <ScrollText speed={80}>{formatArtistName()}</ScrollText>
              <div className="saveContainer">
                <div
                  title="Save Track"
                  className="material-icons"
                  onClick={saveTrack}
                >
                  add
                </div>
              </div>
            </div>
            <div className="albumImageContainer">
              {current.preview && (
                <audio id={current.id} muted>
                  <source src={current.preview} />
                </audio>
              )}
              <img className="albumImage" src={current.img} />
            </div>
            <div className="optionsContainer">
              {current.preview && (
                <div className="previewContainer" onClick={handleClick}>
                  {current.playing ? (
                    <button className="previewButton styledButton">
                      Pause Preview
                    </button>
                  ) : (
                    <button className="previewButton styledButton">
                      Play Preview
                    </button>
                  )}
                </div>
              )}
              <div className="fullSongContainer">
                <a href={current.fullLink} target="_blank">
                  <button className="fullSongButton styledButton">
                    Full Song
                  </button>
                </a>
              </div>
            </div>
          </div>
          {/* Slider Container */}
          <div className="sliderContainer">
            <div className="descContainer">
              <p className="sliderDesc">Description</p>
            </div>
            <div className="sliders">
              <div className="slider">
                <div className="range">
                  {acousticness[0]} - {acousticness[1]}
                </div>
                <p className="desc">Acousticness</p>
                <div className="acousticSlider">
                  <Range
                    className="sliderObject"
                    min={0}
                    max={100}
                    marks={marks}
                    value={acousticness}
                    defaultValue={[0, 100]}
                    trackStyle={[{ backgroundColor: "#fff" }]}
                    railStyle={{ backgroundColor: "#6e6e6e" }}
                    allowCross={false}
                    onChange={(value) => setAcousticness(value)}
                    onAfterChange={getRecommendation}
                  />
                </div>
              </div>
              <div className="slider">
                <div className="range">
                  {danceability[0]} - {danceability[1]}
                </div>
                <div className="desc">Danceability</div>
                <div className="danceSlider">
                  <Range
                    className="sliderObject"
                    min={0}
                    max={100}
                    marks={marks}
                    value={danceability}
                    defaultValue={[0, 100]}
                    trackStyle={[{ backgroundColor: "#fff" }]}
                    railStyle={{ backgroundColor: "#6e6e6e" }}
                    allowCross={false}
                    onChange={(value) => setDanceability(value)}
                    onAfterChange={getRecommendation}
                  />
                </div>
              </div>
              <div className="slider">
                <div className="range">
                  {energy[0]} - {energy[1]}
                </div>
                <p className="desc">Energy</p>
                <div className="energySlider">
                  <Range
                    className="sliderObject"
                    min={0}
                    max={100}
                    marks={marks}
                    value={energy}
                    defaultValue={[0, 100]}
                    trackStyle={[{ backgroundColor: "#fff" }]}
                    railStyle={{ backgroundColor: "#6e6e6e" }}
                    allowCross={false}
                    onChange={(value) => setEnergy(value)}
                    onAfterChange={getRecommendation}
                  />
                </div>
              </div>
              <div className="slider">
                <div className="range">
                  {valence[0]} - {valence[1]}
                </div>
                <p className="desc">Positivity</p>
                <div className="valenceSlider">
                  <Range
                    className="sliderObject"
                    min={0}
                    max={100}
                    marks={marks}
                    value={valence}
                    defaultValue={[0, 100]}
                    trackStyle={[{ backgroundColor: "#fff" }]}
                    railStyle={{ backgroundColor: "#6e6e6e" }}
                    allowCross={false}
                    onChange={(value) => setValence(value)}
                    onAfterChange={getRecommendation}
                  />
                </div>
              </div>
              <div className="slider">
                <div className="range">
                  {popularity[0]} - {popularity[1]}
                </div>
                <div className="desc">Popularity</div>
                <div className="popularitySlider">
                  <Range
                    className="sliderObject"
                    min={0}
                    max={100}
                    marks={marks}
                    value={popularity}
                    defaultValue={[0, 100]}
                    trackStyle={[{ backgroundColor: "#fff" }]}
                    railStyle={{ backgroundColor: "#6e6e6e" }}
                    allowCross={false}
                    onChange={(value) => setPopularity(value)}
                    onAfterChange={getRecommendation}
                  />
                </div>
              </div>
              <button
                id="reset"
                onClick={() => {
                  resetSlider();
                  getRecommendation();
                }}
              >
                Reset
              </button>
            </div>
          </div>
          {/* Radar Container */}
          <div className="radarContainer">
            <h1 className="chartTitle">Track Analytics</h1>
            <div className="chartContainer">
              <Radar
                className={"radar"}
                height={300}
                width={400}
                data={dataContent}
                options={option}
              />
            </div>
            <div className="navButtons">
              <button
                className="optionButton"
                onClick={() => history.push("/emoji")}
              >
                Emoji Recommendation
              </button>
              <button
                className="optionButton"
                onClick={() => history.push("/sentiment")}
              >
                Sentiment Analysis Recommendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
