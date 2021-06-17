import { useCallback } from "react";
import AverageChart from "../components/AverageChart";
import { useDispatch, useSelector } from "react-redux";
import { getTopTracksThunk } from "../redux/action";

export default function AverageChartContainer() {
  const topTracks = useSelector((state) => state.data.topTracks);
  const trackAnalytics = useSelector((state) => state.data.trackAnalytics);
  const user = useSelector((state) => state.user);
  let list = [];

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
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
        fill: true,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    scale: {
      ticks: {
        maxTicksLimit: 3,
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20,
          },
        },
      },
    },
    scales: {
      r: {
        pointLabels: {
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
      topTracks={topTracks.content}
      trackAnalytics={trackAnalytics.content}
      getTopTracks={getTopTracks}
      averageFunction={averageList}
      data={data}
      options={options}
      user={user}
    ></AverageChart>
  );
}
