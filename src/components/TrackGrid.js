import { useState, useEffect } from "react";
import MyLoader from "./ContentLoader";
import "./TrackGrid.css";
import Coverflow from "react-coverflow";

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
  const [current, setCurrent] = useState({
    name: "",
    img: "",
    id: -1,
    artists: [],
  });

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

  const formatArtistName = () => {
    return current.artists.map((artist) => artist.name).join(", ");
  };

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
              <div>
                <audio id={ind} muted>
                  <source src={each_item.preview_url} />
                </audio>
              </div>
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
                        document.getElementById(playingInd).muted = true;
                        document.getElementById(playingInd).pause();
                      }
                      setCurrent({
                        name: each_item.name,
                        img: each_item.album.images[0].url,
                        id: ind,
                        artists: each_item.artists,
                      });
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

      <div className="player">
        <div className="currentImageContainer">
          {current.name && <img className="currentImage" src={current.img} />}
        </div>
        {current.name && (
          <div className="songInfoContainer">
            <div className="songName">{current.name}</div>
            <div className="artistName">{formatArtistName()}</div>
          </div>
        )}
        {current.name && (
          <div className="playButtonContainer">
            <a>
              <img
                className="playButton"
                src={
                  "https://www.pinclipart.com/picdir/big/217-2172073_free-music-icons-play-button-icon-minimalist-clipart.png"
                }
                onClick={() => {
                  if (!document.getElementById(playingInd).paused) {
                    document.getElementById(playingInd).pause();
                  } else {
                    document.getElementById(playingInd).play();
                  }
                }}
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
