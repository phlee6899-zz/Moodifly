import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentSongThunk } from "../redux/action";
import MyLoader from "./ContentLoader";
import "./TrackGrid.css";
import { PlayButton, PauseButton } from "./PlayButton";
import history from "../history";
import { Swiper, SwiperSlide } from "swiper/react";
import ScrollText from "react-scroll-text";
import "swiper/swiper.min.css";
import "swiper/components/effect-coverflow/effect-coverflow.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import spotifyApi from "../Spotify";

import SwiperCore, {
  Navigation,
  EffectCoverflow,
  Pagination,
  Autoplay,
} from "swiper/core";

SwiperCore.use([Navigation, EffectCoverflow, Pagination, Autoplay]);

export default function TrackGrid({
  topTrackLoading,
  countryPlaylistLoading,
  topTracks,
  topArtists,
  countryPlaylist,
  getTopTracks,
  getTopArtists,
  getCountryPlaylist,
  user,
}) {
  const dispatch = useDispatch();

  const token = useSelector((state) => {
    return state.token;
  });

  spotifyApi.setAccessToken(token.token);

  const [current, setCurrent] = useState({
    name: "",
    img: "",
    id: -1,
    playing: false,
    artists: [],
    features: {},
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
      topTracks.length === 0 &&
      !countryPlaylist
    ) {
      console.log("TRACKGRID ARTIST");
      getCountryPlaylist(user.user.country);
    }
  }, [topTracks]);

  useEffect(() => {
    console.log("here");
    if (topArtists === undefined) {
      console.log("in");
      getTopArtists();
    }
  }, []);

  const formatArtistName = () => {
    return current.artists.map((artist) => artist.name).join(", ");
  };

  return (
    <div className="TrackGridContainer">
      <div className="carouselContainer">
        <Swiper
          effect={"coverflow"}
          grabCursor={false}
          centeredSlides={true}
          slidesPerView={"auto"}
          slideToClickedSlide={true}
          initialSlide="5"
          navigation
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          {topTracks &&
            !countryPlaylist &&
            topTracks.map((each_item, ind) => {
              return (
                <SwiperSlide>
                  <div>
                    <audio
                      id={ind}
                      muted
                      onEnded={() => {
                        document.getElementById(ind).currentTime = 0;
                        document
                          .querySelector(".playButton.playing")
                          .classList.remove("playing");
                      }}
                    >
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
                      onClick={(e) => {
                        if (
                          !document.getElementById(ind).paused ||
                          document.getElementById(ind).currentTime
                        ) {
                          e.currentTarget.classList.remove("playing");
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
                          const playingList =
                            document.querySelectorAll(".playButton");
                          playingList.forEach((each_element) => {
                            each_element.classList.remove("playing");
                          });
                          if (0 <= current.id) {
                            document.getElementById(current.id).muted = true;
                            document.getElementById(current.id).pause();
                          }
                          e.currentTarget.classList.add("playing");
                          dispatch(
                            getCurrentSongThunk({
                              name: current.name,
                              img: current.img,
                              id: each_item.id,
                              playing: false,
                              artists: current.artists,
                            })
                          );
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
                </SwiperSlide>
              );
            })}
          {countryPlaylist &&
            countryPlaylist.map((each_item, ind) => {
              return (
                <SwiperSlide>
                  <div>
                    <audio
                      id={ind}
                      muted
                      onEnded={() => {
                        document.getElementById(ind).currentTime = 0;
                        document
                          .querySelector(".playButton.playing")
                          .classList.remove("playing");
                      }}
                    >
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
                      onClick={(e) => {
                        if (
                          !document.getElementById(ind).paused ||
                          document.getElementById(ind).currentTime
                        ) {
                          e.currentTarget.classList.remove("playing");
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
                          const playingList =
                            document.querySelectorAll(".playButton");
                          playingList.forEach((each_element) => {
                            each_element.classList.remove("playing");
                          });
                          if (0 <= current.id) {
                            document.getElementById(current.id).muted = true;
                            document.getElementById(current.id).pause();
                          }
                          e.currentTarget.classList.add("playing");
                          dispatch(
                            getCurrentSongThunk({
                              name: current.name,
                              img: current.img,
                              id: each_item.id,
                              playing: false,
                              artists: current.artists,
                            })
                          );
                          setCurrent({
                            name: each_item.name,
                            img: each_item.album.images[0].url,
                            id: ind,
                            playing: true,
                            artists: each_item.artists,
                          });
                          console.log(current.name);
                          document.getElementById(ind).muted = false;
                          document.getElementById(ind).play();
                        }
                      }}
                    />
                  </a>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>

      <div className="infoContainer">
        {current.name && (
          <div className="songInfoContainer">
            <ScrollText speed={100} className="songName">
              {current.name}
            </ScrollText>
            <ScrollText speed={100} className="artistName">
              {formatArtistName()}
            </ScrollText>
          </div>
        )}
      </div>
    </div>
  );
}
