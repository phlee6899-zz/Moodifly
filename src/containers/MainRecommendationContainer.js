import { useCallback } from "react";
import MainRecommendation from "../components/MainRecommendation";
import { useDispatch, useSelector } from "react-redux";
import { getTopTracksThunk, getTopArtistsThunk } from "../redux/action";

export default function MainRecommendationContainer() {
  const dispatch = useDispatch();

  const topTracks = useSelector((state) => state.data.topTracks.content);
  const topArtists = useSelector((state) => state.data.topArtists.content);

  const options = {
    scale: {
      ticks: {
        maxTicksLimit: 2,
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
    <MainRecommendation
      topTrackLoading={topTracks.loading}
      topArtistsLoading={topArtists.loading}
      options={options}
    ></MainRecommendation>
  );
}
