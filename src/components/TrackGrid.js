import { useState, useEffect } from "react";
import MyLoader from "./ContentLoader";
import "./TrackGrid.css";
import { PlayButton, PauseButton } from "./PlayButton";
import Slider from "react-slick";
import history from "../history";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TrackGrid({
  topTrackLoading,
  countryPlaylistLoading,
  topTracks,
  countryPlaylist,
  getTopTracks,
  getTopArtists,
  getCountryPlaylist,
  user,
}) {
  const [current, setCurrent] = useState({
    name: "",
    img: "",
    id: -1,
    playing: false,
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

  useEffect(() => {
    getTopArtists();
  }, []);

  const formatArtistName = () => {
    return current.artists.map((artist) => artist.name).join(", ");
  };

  const handleClick = () => {
    if (0 <= current.id && !current.playing) {
      document.getElementById(current.id).muted = false;
      document.getElementById(current.id).play();
      setCurrent({
        name: current.name,
        img: current.img,
        id: current.id,
        playing: true,
        artists: current.artists,
      });
    } else if (0 <= current.id && current.playing) {
      document.getElementById(current.id).muted = true;
      document.getElementById(current.id).pause();
      setCurrent({
        name: current.name,
        img: current.img,
        id: current.id,
        playing: false,
        artists: current.artists,
      });
    }
  };

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          width: "20px",
          height: "20px",
          background: "black",
        }}
        onClick={onClick}
      />
    );
  }

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          width: "20px",
          height: "20px",
          background: "black",
        }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: true,
    centrePadding: "30px",
    focusOnSelect: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
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
      <div className="carouselContainer">
        <Slider {...settings}>
          {topTracks &&
            topTracks.map((each_item, ind) => {
              return (
                <div className="trackContainer">
                  <div>
                    <audio id={ind} muted>
                      <source src={each_item.preview_url} />
                    </audio>
                  </div>
                  <img
                    className="trackImage"
                    src={each_item.album.images[0].url}
                  />
                  <div className="overlay" />
                  <a>
                    <div
                      className="playButton"
                      onClick={() => {
                        if (
                          !document.getElementById(ind).paused ||
                          document.getElementById(ind).currentTime
                        ) {
                          setCurrent({
                            name: current.name,
                            img: current.img,
                            id: current.id,
                            playing: false,
                            artists: current.artists,
                          });
                          document.getElementById(ind).muted = true;
                          document.getElementById(ind).pause();
                          document.getElementById(ind).currentTime = 0;
                        } else {
                          if (0 <= current.id) {
                            document.getElementById(current.id).muted = true;
                            document.getElementById(current.id).pause();
                          }
                          setCurrent({
                            name: each_item.name,
                            img: each_item.album.images[0].url,
                            id: ind,
                            playing: true,
                            artists: each_item.artists,
                          });
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
                  <div>
                    <audio id={ind} muted>
                      <source src={each_item.preview_url} />
                    </audio>
                  </div>
                  <img
                    className="trackImage"
                    src={each_item.album.images[0].url}
                  />
                  <div className="overlay" />
                  <a>
                    <div
                      className="playButton"
                      onClick={() => {
                        if (
                          !document.getElementById(ind).paused ||
                          document.getElementById(ind).currentTime
                        ) {
                          setCurrent({
                            name: current.name,
                            img: current.img,
                            id: current.id,
                            playing: false,
                            artists: current.artists,
                          });
                          document.getElementById(ind).muted = true;
                          document.getElementById(ind).pause();
                          document.getElementById(ind).currentTime = 0;
                        } else {
                          if (0 <= current.id) {
                            document.getElementById(current.id).muted = true;
                            document.getElementById(current.id).pause();
                          }
                          setCurrent({
                            name: each_item.name,
                            img: each_item.album.images[0].url,
                            id: ind,
                            playing: true,
                            artists: each_item.artists,
                          });
                          document.getElementById(ind).muted = false;
                          document.getElementById(ind).play();
                        }
                      }}
                    />
                  </a>
                </div>
              );
            })}
        </Slider>
      </div>

      <div className="player">
        <div className="currentImageContainer">
          {current.name && <img className="currentImage" src={current.img} />}
          {!current.name && <div className="noAlbum"></div>}
        </div>
        {current.name && (
          <div className="songInfoContainer">
            <div className="songName">{current.name}</div>
            <div className="artistName">{formatArtistName()}</div>
          </div>
        )}
        {
          <div className="playButtonContainer">
            {current.playing ? (
              <PauseButton onButtonClick={handleClick} />
            ) : (
              <PlayButton onButtonClick={handleClick} />
            )}
          </div>
        }
      </div>

      <div className="recOptions">
        <button className="emojiRec">Emoji Recommendation</button>
        <button className="textRec">
          Text Sentiment Analysis Recommendation
        </button>
        <button className="mainRec" onClick={() => history.push("/mainrec")}>
          Listening History Recommendation
        </button>
      </div>
    </div>
  );
}
