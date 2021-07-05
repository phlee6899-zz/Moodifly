import spotifyApi from "../Spotify";
import history from "../history";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Radar, Doughnut } from "react-chartjs-2";
import NavBar from "./Navbar";
import "rc-slider/assets/index.css";
import "./SentimentRecommendation.css";
import ScrollText from "react-scroll-text";
import axios from "axios";
import { debounce } from "lodash";
import TextLoop from "react-text-loop";

export default function SentimentRecommendation() {
  const [features, setFeatures] = useState({});
  const [score, setScore] = useState({});
  const [error, setError] = useState("");

  const topTracks = useSelector((state) => state.data.topTracks.content);
  const topArtists = useSelector((state) => state.data.topArtists.content);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (token === "") {
      history.push("/login");
    }
  }, []);

  const token = useSelector((state) => {
    return state.token;
  });

  spotifyApi.setAccessToken(token.token);

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
  const formatArtistName = () => {
    return current.artists.map((artist) => artist.name).join(", ");
  };

  const parameterTune = (score) => {
    let minValence = 0;
    let maxValence = 0;
    let minEnergy = 0;
    let maxEnergy = 0;
    let targetValence = 0;

    switch (score) {
      case 0:
        minValence = 0;
        maxValence = 0.25;
        minEnergy = 0;
        maxEnergy = 0.3;
        targetValence = score / 4;
        break;
      case 1:
        minValence = 0;
        maxValence = 0.4;
        minEnergy = 0;
        maxEnergy = 0.4;
        targetValence = score / 4 + 0.05;
        break;
      case 2:
        minValence = 0;
        maxValence = 1;
        minEnergy = 0;
        maxEnergy = 1;
        targetValence = score / 4;
        break;
      case 3:
        minValence = 0.6;
        maxValence = 1;
        minEnergy = 0.6;
        maxEnergy = 1;
        targetValence = score / 4;
        break;
      case 4:
        minValence = 0.75;
        maxValence = 1;
        minEnergy = 0.7;
        maxEnergy = 1;
        targetValence = score / 4;
        break;
    }
    return [minValence, maxValence, minEnergy, maxEnergy, targetValence];
  };

  const delayRec = debounce(() => {
    if (current.id && current.preview) {
      setCurrent({ ...current, playing: false });
      document.getElementById(current.id).muted = true;
      document.getElementById(current.id).pause();
      document.getElementById(current.id).currentTime = 0;
    }
    axios
      .post(
        "http://localhost:8080/api",
        {
          text: document.querySelector(".inputText").value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setScore({
          very_negative: res.data.score.very_NEGATIVE,
          negative: res.data.score.negative,
          neutral: res.data.score.neutral,
          positive: res.data.score.positive,
          very_positive: res.data.score.very_POSTIVE,
        });

        const params = parameterTune(res.data.overall);
        console.log(params);

        spotifyApi
          .getRecommendations({
            market: user.country,
            seed_artists: topArtists.slice(0, 3).map((artist) => artist.id),
            seed_tracks: topTracks.slice(0, 2).map((track) => track.id),
            limit: 20,
            min_acousticness: 0,
            max_acousticness: 1,
            min_danceability: 0,
            max_danceability: 1,
            min_energy: params[2],
            max_energy: params[3],
            min_valence: params[0],
            max_valence: params[1],
            target_valence: params[4],
            min_popularity: 50,
            max_popularity: 100,
          })
          .then((songs) => {
            const randomInd = Math.floor(Math.random() * songs.tracks.length);

            const song = {
              tracks: [songs.tracks[randomInd]],
            };

            if (typeof song.tracks[0] === "undefined") {
              setError("No recommendation available. We want to hear more!");
              return;
            }
            setError("");
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
                console.log(feature.valence);
                console.log(feature.energy);
                console.log("****");
              });
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, 700);
  const getRecommendation = () => {
    const el = document.querySelector(".inputText");
    let user_input = el.value;
    user_input = user_input.replace(/[^A-Za-z\s0-9.,?!@#$%+=]/gi, "");
    el.value = user_input;
    delayRec();
  };

  const saveTrack = () => {
    console.log("saved");
    spotifyApi.addToMySavedTracks({ ids: [current.id] });
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
        label: "Current Track's Track Analysis",
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

  const donutData = {
    labels: [
      "Very Negative",
      "Negative",
      "Neutral",
      "Positive",
      "Very Positive",
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: [
          score.very_negative,
          score.negative,
          score.neutral,
          score.positive,
          score.very_positive,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "black",
          "white",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const donutOptions = {
    plugins: {
      legend: {
        position: "left",
        labels: {
          color: "white",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="container">
      {/* Header */}
      <NavBar />
      <div className="mainContainer">
        {/* textContainer */}
        <div className="textContainer">
          {/* <p className="textDesc">
            Write Down Your Thoughts, Feelings, Or Really Anything
          </p> */}

          <div className="optionLoop">
            <p>Write Down Your </p>
            <TextLoop interval={2000}>
              <span>Thoughts</span>
              <span>Feelings</span>
              <span>Or Really Anything</span>
            </TextLoop>{" "}
          </div>
          <textarea
            className="inputText"
            placeholder="Music Recommendation Based On Sentiment Analysis"
            onKeyUp={getRecommendation}
          ></textarea>
          {error && <p className="errorText">{error}</p>}
          {current.name && (
            <div className="donutContainer">
              <Doughnut
                width={250}
                height={250}
                data={donutData}
                options={donutOptions}
              ></Doughnut>
            </div>
          )}
        </div>
        {/* currentSongContainer */}
        {current.name && (
          <div className="currentSongContainer">
            <div className="songTitle">
              <ScrollText speed={80}>{current.name}</ScrollText>
            </div>
            <div className="artistName">
              <ScrollText speed={80}>{formatArtistName()}</ScrollText>
              <div className="saveContainer">
                <div className="material-icons" onClick={saveTrack}>
                  add
                </div>
              </div>
            </div>
            <div className="albumImageContainer">
              {current.preview && (
                <audio
                  id={current.id}
                  muted
                  onEnded={() => {
                    document.getElementById(current.id).currentTime = 0;
                    setCurrent({ ...current, playing: false });
                  }}
                >
                  <source src={current.preview} />
                </audio>
              )}
              <img className="albumImage" src={current.img} />
            </div>
            <div className="optionsContainer">
              {current.preview && (
                <div className="previewContainer" onClick={handleClick}>
                  {current.playing ? (
                    <button className="previewButton styleButton">
                      Pause Preview
                    </button>
                  ) : (
                    <button className="previewButton styleButton">
                      Play Preview
                    </button>
                  )}
                </div>
              )}
              <div className="fullSongContainer">
                <a href={current.fullLink} target="_blank">
                  <button className="fullSongButton styleButton">
                    Full Song
                  </button>
                </a>
              </div>
              {/* {current.playing ? (
                          <PauseButton onButtonClick={handleClick} />
                        ) : (
                          <PlayButton onButtonClick={handleClick} />
                        )} */}
            </div>
          </div>
        )}
        {/* Radar Container */}
        {current.name && (
          <div className="radarContainer">
            <h1 className="chartTitle">Current Track Analysis</h1>
            <div className="chartContainer">
              <Radar
                className={"radar"}
                height={300}
                width={300}
                data={dataContent}
                options={option}
              />
            </div>
            <div className="navButtons">
              <button
                className="optionButton"
                onClick={() => history.push("/emojirec")}
              >
                Emoji Recommendation
              </button>
              <button
                className="optionButton"
                onClick={() => history.push("/mainrec")}
              >
                Listening History Recommendation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
