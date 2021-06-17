import { useSelector } from "react-redux";
import history from "../history";
import { useEffect } from "react";
import TrackGridContainer from "../containers/TrackGridContainer";
import AverageChartContainer from "../containers/AverageChartContainer";

export default function Main() {
  const token = useSelector((state) => {
    return state.token;
  });

  useEffect(() => {
    if (token === "") {
      history.push("/login");
    }
  }, []);

  return (
    <div className="Container">
      {token && (
        <div className="mainContainer">
          <TrackGridContainer></TrackGridContainer>
          <AverageChartContainer></AverageChartContainer>
        </div>
      )}
    </div>
  );
}
