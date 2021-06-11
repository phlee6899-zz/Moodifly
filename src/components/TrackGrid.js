import { useState, useEffect } from "react";
import MyLoader from "./ContentLoader";
import "./TrackGrid.css";

export default function TrackGrid({
  topTrackLoading,
  countryPlaylistLoading,
  topTracks,
  countryPlaylist,
  getTopTracks,
  getCountryPlaylist,
  user,
}) {
  const [playingInd, setPlayingInd] = useState(-1);

  useEffect(() => {
    if (user.user !== undefined) {
      getTopTracks(user.user.country);
    }
  }, [user]);

  useEffect(() => {
    if (
      user.user !== undefined &&
      topTracks !== undefined &&
      topTracks.length === 0
    ) {
      getCountryPlaylist(user.user.country);
    }
  }, [topTracks]);

  return (
    <div className="TrackGridContainer">
      {/* {!topTrackLoading && topTracks ? (
        <p className="trackGridLabel">Popular Near You</p>
      ) : (
        <p className="trackGridLabel">Your Favorite</p>
      )} */}
      {topTrackLoading &&
        [...Array(20)].map(() => {
          return <MyLoader />;
        })}
      {topTracks &&
        topTracks.map((each_item, ind) => {
          return (
            <div className="trackContainer">
              <audio id={ind} muted>
                <source src={each_item.preview_url} />
              </audio>
              <img className="trackImage" src={each_item.album.images[0].url} />
              <div className="overlay" />
              <a>
                <div
                  className="playButton"
                  onClick={() => {
                    if (
                      !document.getElementById(ind).paused ||
                      document.getElementById(ind).currentTime
                    ) {
                      setPlayingInd(-1);
                      document.getElementById(ind).muted = true;
                      document.getElementById(ind).pause();
                      document.getElementById(ind).currentTime = 0;
                    } else {
                      if (0 <= playingInd) {
                        document.getElementById(playingInd).pause();
                        document.getElementById(playingInd).muted = true;
                      }
                      setPlayingInd(ind);
                      document.getElementById(ind).muted = false;
                      document.getElementById(ind).play();
                    }
                  }}
                />
              </a>
            </div>
          );
        })}
      {countryPlaylist &&
        countryPlaylist.map((each_item, ind) => {
          return (
            <div className="trackContainer">
              <audio id={ind} muted>
                <source src={each_item.preview_url} />
              </audio>
              <img className="trackImage" src={each_item.album.images[0].url} />
              <div className="overlay" />
              <a>
                <div
                  className="playButton"
                  onClick={() => {
                    if (
                      !document.getElementById(ind).paused ||
                      document.getElementById(ind).currentTime
                    ) {
                      setPlayingInd(-1);
                      document.getElementById(ind).muted = true;
                      document.getElementById(ind).pause();
                      document.getElementById(ind).currentTime = 0;
                    } else {
                      if (0 <= playingInd) {
                        document.getElementById(playingInd).pause();
                      }
                      setPlayingInd(ind);
                      document.getElementById(ind).muted = false;
                      document.getElementById(ind).play();
                    }
                  }}
                />
              </a>
            </div>
          );
        })}
    </div>
  );
}
