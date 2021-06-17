import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import MyLoader from "./ContentLoader";
import "./AverageChart.css";

export default function AverageChart({
  topTrackLoading,
  trackAnalyticsLoading,
  topTracks,
  trackAnalytics,
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
        ],
      }));
    }
  }, [trackAnalytics]);

  return (
    <div className="AverageChartContainer">
      {trackAnalyticsLoading &&
        [...Array(20)].map(() => {
          return <MyLoader />;
        })}
      {trackAnalytics && (
        <div className="radarChart">
          <Radar
            className={"radar"}
            height={400}
            width={600}
            data={list}
            options={options}
          />
        </div>
      )}
    </div>
  );
}
