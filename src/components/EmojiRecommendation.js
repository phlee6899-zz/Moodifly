import spotifyApi from "../Spotify";
import history from "../history";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import NavBar from "./Navbar";
import "rc-slider/assets/index.css";
import "./EmojiRecommendation.css";
import ScrollText from "react-scroll-text";
import { sampleSize, shuffle } from "lodash";
import { fullData, randomize } from "../data";

export default function EmojiRecommendation() {
  const [features, setFeatures] = useState({});
  const [selected, setSelected] = useState([]);
  const [emojiList, setList] = useState(randomize());
  const [error, setError] = useState("");

  const topTracks = useSelector((state) => state.data.topTracks.content);
  const topArtists = useSelector((state) => state.data.topArtists.content);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (token === "") {
      history.push("/login");
    }
  }, []);

  useEffect(() => {
    if (selected.length > 0) {
      const params = parameterTune(selected);
      getRecommendation(params);
    }
  }, [selected]);

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

  const parameterTune = (emojis) => {
    let minValence = 0;
    let maxValence = 1;
    let targetValence = 0;
    let minInstrumentalness = 0;
    let maxInstrumentalness = 1;
    let minEnergy = 0;
    let maxEnergy = 1;
    let length = emojis.length;
    let isClassical = 0;
    let isSlow = 0;

    emojis.forEach((emoji) => {
      let overall = (emoji.overall + 1) / 2;

      switch (emoji.category) {
        case "happy":
          targetValence += overall;
          break;
        case "negative":
          targetValence += overall;
          break;
        case "fast":
          targetValence += overall;
          break;
        case "slow":
          targetValence += overall;
          isSlow = 1;
          break;
        case "instrumental":
          targetValence += overall;
          minInstrumentalness = 0.65;
          isClassical = 1;
          break;
      }
    });

    const finalValence = targetValence / length;
    switch (true) {
      case finalValence < 0.4:
        maxEnergy = 0.3;
        maxValence = 0.4;
        break;
      case finalValence < 0.5:
        maxEnergy = 0.45;
        maxValence = 0.5;
        break;
      case 0.75 <= finalValence:
        minEnergy = 0.65;
        minValence = 0.6;
      case 0.5 <= finalValence:
        minValence = 0.5;
        minEnergy = 0.5;
    }

    if (isSlow) {
      minEnergy = 0;
      maxEnergy = 0.4;
    }

    return [
      minValence,
      maxValence,
      finalValence,
      minInstrumentalness,
      maxInstrumentalness,
      minEnergy,
      maxEnergy,
      isClassical,
    ];
  };

  const getRecommendation = (params) => {
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

    if (params[7]) {
      spotifyApi
        .getRecommendations({
          market: user.country,
          // seed_artists: topArtists.slice(0, 2).map((artist) => artist.id),
          // seed_tracks: topTracks.slice(0, 2).map((track) => track.id),
          seed_genres: "classical",
          limit: 20,
          // min_energy: params[5],
          // max_energy: params[6],
          min_valence: params[0],
          max_valence: params[1],
          target_valence: params[2],
          min_instrumentalness: 0.6,
          max_instrumentalness: 1,
          min_popularity: 0,
          max_popularity: 100,
        })
        .then((songs) => {
          const randomInd = Math.floor(Math.random() * songs.tracks.length);

          const song = {
            tracks: [songs.tracks[randomInd]],
          };

          if (typeof song.tracks[0] === "undefined") {
            setError("No recommendation available. Diversify your selection!");
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
            });
        })
        .catch((error) => {
          console.log(error);
          history.push("/login");
        });
    } else {
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
          limit: 20,
          min_energy: params[5],
          max_energy: params[6],
          min_valence: params[0],
          max_valence: params[1],
          target_valence: params[2],
          min_popularity: 50,
          max_popularity: 100,
        })
        .then((songs) => {
          const randomInd = Math.floor(Math.random() * songs.tracks.length);

          const song = {
            tracks: [songs.tracks[randomInd]],
          };

          if (typeof song.tracks[0] === "undefined") {
            setError("No recommendation available. Diversify your selection!");
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
            });
        })
        .catch((error) => {
          console.log(error);
          history.push("/login");
        });
    }
  };

  const saveTrack = () => {
    // console.log("saved");
    try {
      spotifyApi.addToMySavedTracks({ ids: [current.id] });
    } catch (error) {
      history.push("/login");
    }
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

  return (
    <div className="container">
      {/* Header */}
      <NavBar />
      <div className="mainContainer">
        {/* textContainer */}
        <div className="emojiContainer">
          <p className="textDesc">Select Emoji</p>
          <div className="emojiBox">
            {emojiList.map((emoji, ind) => {
              return (
                <p
                  className="emoji"
                  id={emoji.sequence}
                  key={emoji.sequence}
                  onClick={(e) => {
                    if (0 <= selected.length && selected.length < 5) {
                      setSelected([emoji, ...selected]);
                    } else if (selected.length == 5) {
                      selected.pop(0);
                      setSelected([emoji, ...selected]);
                    } else {
                      setSelected([emoji]);
                    }
                  }}
                >
                  {String.fromCodePoint(emoji.sequence)}
                </p>
              );
            })}
          </div>
          {error && <p className="errorText">{error}</p>}
          <button
            className="randomButton"
            onClick={() => {
              setList(randomize());
            }}
          >
            Randomize
          </button>
          {selected.length > 0 && (
            <div className="selectionBox">
              {selected.map((emoji) => {
                return (
                  <p
                    className="selectedEmoji"
                    onClick={(e) => {
                      // document.querySelector()
                      const selectedInd = [].indexOf.call(
                        document.querySelectorAll(".selectedEmoji"),
                        e.target
                      );
                      selected.splice(selectedInd, 1);
                      setSelected([...selected]);
                    }}
                  >
                    {String.fromCodePoint(emoji.sequence)}
                  </p>
                );
              })}
            </div>
          )}
          {selected.length > 0 && (
            <button
              className="resetButton"
              onClick={() => {
                setSelected({});
              }}
            >
              Reset
            </button>
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
                onClick={() => history.push("/history")}
              >
                Listening History Recommendation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function emojiCategory(category, num) {
    return emojiList
      .filter((object) => {
        return object.category == category;
      })
      .map((emoji) => {
        return <p className="emoji">{String.fromCodePoint(emoji.sequence)}</p>;
      });
  }
}
