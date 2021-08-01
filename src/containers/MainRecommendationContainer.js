import MainRecommendation from "../components/ListeningHistory/MainRecommendation";
import { useSelector } from "react-redux";

export default function MainRecommendationContainer() {
  const topTracks = useSelector((state) => state.data.topTracks.content);
  const topArtists = useSelector((state) => state.data.topArtists.content);

  return (
    <MainRecommendation
      topTrackLoading={topTracks.loading}
      topArtistsLoading={topArtists.loading}
    ></MainRecommendation>
  );
}
