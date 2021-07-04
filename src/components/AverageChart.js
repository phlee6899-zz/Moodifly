import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Radar } from "react-chartjs-2";
import MyLoader from "./ContentLoader";
import history from "../history";
import "./AverageChart.css";

export default function AverageChart({
  topTrackLoading,
  trackAnalyticsLoading,
  currentSongLoading,
  topTracks,
  trackAnalytics,
  features,
  getTopTracks,
  averageFunction,
  data,
  options,
  user,
}) {
  const [list, setList] = useState(data);

  useEffect(() => {
    if (user.user !== undefined) {
      getTopTracks(user.user.country);
    }
  }, [user]);

  useEffect(() => {
    if (!trackAnalyticsLoading && trackAnalytics) {
      setList((prevList) => ({
        ...prevList,
        datasets: [
          {
            ...prevList.datasets[0],
            data: averageFunction(trackAnalytics),
          },
          ...prevList.datasets.slice(1),
        ],
      }));
    }
  }, [trackAnalytics]);

  useEffect(() => {
    if (!currentSongLoading && features) {
      setList((prevList) => ({
        ...prevList,
        datasets: [
          ...prevList.datasets.slice(0, 1),
          {
            ...prevList.datasets[1],
            data: Object.keys(features).map((key) => features[key]),
          },
        ],
      }));
    }
  }, [features]);

  return (
    <div className="AverageChartContainer">
      {trackAnalytics && (
        <div>
          <p className="chartTitle">Overview</p>
          <div className="radarChart">
            <Radar
              className={"radar"}
              height={290}
              width={360}
              data={list}
              options={options}
            />
          </div>
        </div>
      )}
      <div className="recOptions">
        <button
          className="optionButton"
          onClick={() => history.push("/emojirec")}
        >
          Emoji Recommendation
        </button>
        <button
          className="optionButton"
          onClick={() => history.push("/sentimentrec")}
        >
          Text Sentiment Analysis Recommendation
        </button>
        <button
          className="optionButton"
          onClick={() => history.push("/mainrec")}
        >
          Listening History Recommendation
        </button>
      </div>
    </div>
  );
}
