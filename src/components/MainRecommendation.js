import spotifyApi from "../Spotify";
import history from "../history";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";

export default function MainRecommendation({
  topTrackLoading,
  topArtistsLoading,
  options,
}) {
  const [features, setFeatures] = useState({});

  const [acousticness, setAcousticness] = useState([0, 100]);
  const [danceability, setDanceability] = useState([0, 100]);
  const [energy, setEnergy] = useState([0, 100]);
  const [valence, setValence] = useState([0, 100]);
  const [popularity, setPopularity] = useState([0, 100]);

  const [isAcousticVisible, setAcousticVisibility] = useState(false);
  const [isDanceabilityVisible, setDanceVisability] = useState(false);
  const [isEnergyVisible, setEnergyVisibility] = useState(false);
  const [isValenceVisible, setValenceVisibility] = useState(false);
  const [isPopularityVisible, setPopularVisibility] = useState(false);

  const topTracks = useSelector((state) => state.data.topTracks.content);
  const topArtists = useSelector((state) => state.data.topArtists.content);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (token === "") {
      history.push("/login");
    }
  }, []);

  useEffect(() => {
    getRecommendation();
  }, []);

  const token = useSelector((state) => {
    return state.token;
  });

  const [current, setCurrent] = useState({
    name: "",
    img: "",
    id: "",
    uri: "",
    artists: [],
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
    spotifyApi
      .getRecommendations({
        market: user.country,
        seed_artists: topArtists.slice(0, 2).map((artist) => artist.id),
        seed_tracks: topTracks.slice(0, 3).map((track) => track.id),
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
        console.log(song);
        if (song.tracks.length === 0) {
          alert(
            "No recommendations for your preferences! Try expanding your search options."
          );
          resetSlider();
          return;
        } else {
          console.log(song);
          setCurrent({
            name: song.tracks[0].name,
            img: song.tracks[0].album.images[0].url,
            artists: song.tracks[0].artists,
            uri: song.tracks[0].uri,
            id: song.tracks[0].id,
          });

          spotifyApi
            .getAudioFeaturesForTrack(song.tracks[0].id)
            .then((feature) => {
              spotifyApi.getTrack(song.tracks[0].id).then((track) => {
                setFeatures({ ...feature, popularity: track.popularity });
              });
            });
        }
      });
  };

  const saveTrack = () => {
    spotifyApi.addToMySavedTracks({ ids: [current.id] });
    getRecommendation();
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
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
        fill: true,
        borderWidth: 3,
      },
    ],
  };

  return (
    <div className="container">
      {current.name && (
        <div className="mainContainer">
          <div className="radarContainer">
            <Radar
              className={"radar"}
              height={400}
              width={600}
              data={dataContent}
              options={options}
            />
          </div>

          <div className="currentSongContainer">
            <div className="songTitle">{current.name}</div>
            <div className="artistName">{formatArtistName()}</div>
            <div className="albumImageContainer">
              <img className="albumImage" src={current.img} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
