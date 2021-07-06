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
  countryData,
  options,
  user,
}) {
  const [list, setList] = useState(data);
  const [countryList, setCountryList] = useState(countryData);

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
      setCountryList((prevList) => ({
        datasets: [
          {
            ...prevList.datasets[0],
            data: Object.keys(features).map((key) => features[key]),
          },
        ],
      }));
    }
  }, [features]);

  const countryOptions = {
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
      {!trackAnalytics && (
        <div>
          <p className="chartTitle">Overview</p>
          <div className="radarChart">
            <Radar
              className={"radar"}
              height={290}
              width={360}
              data={countryList}
              options={countryOptions}
            />
          </div>
        </div>
      )}
      <div className="recOptions">
        <button
          className="optionButton"
          onClick={() => history.push("/mainrec")}
        >
          Listening History Recommendation
        </button>
        <button
          className="optionButton"
          onClick={() => history.push("/sentimentrec")}
        >
          Text Sentiment Recommendation
        </button>
        <button
          className="optionButton"
          onClick={() => history.push("/emojirec")}
        >
          Emoji Recommendation
        </button>
      </div>
    </div>
  );
}
