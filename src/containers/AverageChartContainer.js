import { useCallback } from "react";
import spotifyApi from "../Spotify";
import AverageChart from "../components/AverageChart";
import { useDispatch, useSelector } from "react-redux";
import { getTopTracksThunk } from "../redux/action";
import { withTheme } from "styled-components";

export default function AverageChartContainer() {
  const topTracks = useSelector((state) => state.data.topTracks);
  const trackAnalytics = useSelector((state) => state.data.trackAnalytics);
  const user = useSelector((state) => state.user);
  const current = useSelector((state) => state.current);

  const token = useSelector((state) => {
    return state.token;
  });

  spotifyApi.setAccessToken(token.token);

  const dispatch = useDispatch();

  const getTopTracks = useCallback(
    (countryCode) => {
      dispatch(getTopTracksThunk(countryCode));
    },
    [dispatch]
  );

  const averageList = (data) => {
    let acousticness = 0;
    let danceability = 0;
    let energy = 0;
    let instrumentalness = 0;
    let popularity = 0;
    let valence = 0;
    data.forEach((track) => {
      acousticness += track.acousticness;
      danceability += track.danceability;
      energy += track.energy;
      instrumentalness += track.instrumentalness;
      popularity += track.popularity;
      valence += track.valence;
    });

    return [
      acousticness / data.length,
      danceability / data.length,
      energy / data.length,
      instrumentalness / data.length,
      valence / data.length,
    ];
  };

  const data = {
    labels: [
      "Acousticness",
      "Danceability",
      "Energy",
      "Instrumentalness",
      "Valence",
    ],
    datasets: [
      {
        label: "Your Music Analysis",
        data: [],
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
      {
        label: "Current Track Analysis",
        data: [],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
        pointBorderWidth: 1,
        pointRadius: 4,
        borderWidth: 3,
      },
    ],
  };

  const countryData = {
    labels: [
      "Acousticness",
      "Danceability",
      "Energy",
      "Instrumentalness",
      "Valence",
    ],
    datasets: [
      {
        label: "Current Track Analysis",
        data: [],
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

  const options = {
    plugins: {
      legend: {
        // display: false,
        labels: {
          color: "white",
          font: {
            size: 15,
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
    <AverageChart
      topTrackLoading={topTracks.loading}
      trackAnalyticsLoading={trackAnalytics.loading}
      currentSongLoading={current.loading}
      topTracks={topTracks.content}
      trackAnalytics={trackAnalytics.content}
      features={current.features}
      getTopTracks={getTopTracks}
      averageFunction={averageList}
      data={data}
      countryData={countryData}
      options={options}
      user={user}
    ></AverageChart>
  );
}
