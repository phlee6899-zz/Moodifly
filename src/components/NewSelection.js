import spotifyApi from "../Spotify";
import history from "../history";
import { useSelector, useDispatch } from "react-redux";
import { addTopArtists } from "../redux/action";
import "./NewSelection.css";
import { useState, useEffect, useCallback } from "react";
import { unionBy } from "lodash";

export default function NewSelection({
  countryPlaylistLoading,
  countryPlaylist,
  getCountryPlaylist,
  user,
}) {
  const dispatch = useDispatch();
  const token = useSelector((state) => {
    return state.token;
  });
  spotifyApi.setAccessToken(token.token);

  const [artistList, setArtistList] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (user !== undefined && user.user !== undefined) {
      getCountryPlaylist(user.user.country);
    }
  }, [user]);

  useEffect(() => {
    if (
      countryPlaylist !== undefined &&
      !countryPlaylistLoading &&
      countryPlaylist.topArtist !== undefined
    ) {
      setArtistList(countryPlaylist.topArtist);
    }
  }, [countryPlaylist]);

  const deleteSelectedArtist = (id) => {
    const updateList = artistList.filter((each_artist) => {
      return (
        // Main - 12 명
        each_artist.main == true ||
        // Click X && Selected
        // (each_artist.id !== id &&
        //   document.getElementById(each_artist.id).firstChild.lastChild.classList
        //     .value === "material-icons check selected") ||
        (each_artist.main == false && each_artist.related !== id) ||
        (each_artist.selected && each_artist.id !== id)
      );
    });
    console.log(updateList);
    setArtistList([...updateList]);
  };

  const getRelated = async (id) => {
    spotifyApi
      .getArtistRelatedArtists(id)
      .then((artists) => {
        const list = artists.artists.map((artist, index) => {
          if (artist.images.length != 0) {
            return {
              main: false,
              related: id,
              name: artist.name,
              id: artist.id,
              popularity: artist.popularity,
              image: artist.images[0].url,
              selected: false,
            };
          }
        });

        const len = artistList.length;
        const final = unionBy(artistList, list, "id")
          .slice(0, len + 3)
          .filter((each_info) => {
            return each_info !== undefined;
          });
        console.log(final);
        setArtistList([...final]);
        // console.log(artistList);
      })
      .catch((error) => {
        console.log(error);
        history.push("/login");
      });
  };

  return (
    <div className="selectContainer">
      <div className="selectionContainer">
        <div className="selectionText">
          We don't have enough information about your music taste.
          <br />
          <br /> Select 5 of your favorite artists!
        </div>
        <div className="selectionBox">
          {artistList &&
            artistList.map((artist) => {
              return (
                <div
                  className="artistContainer"
                  id={artist.id}
                  onClick={(e) => {
                    const selectedAll =
                      document.querySelectorAll(".check.selected");

                    if (
                      selectedAll.length === 5 &&
                      e.currentTarget.firstChild.lastChild.classList.value ===
                        "material-icons check"
                    ) {
                      return;
                    }

                    const selectedEl = e.currentTarget.firstChild.lastChild;
                    if (selectedEl.classList.value === "material-icons check") {
                      selectedEl.classList.add("selected");
                      artist.selected = true;
                      setSelected([...selected, artist.id]);
                      getRelated(artist.id);
                    } else {
                      selectedEl.classList.remove("selected");
                      artist.selected = false;
                      deleteSelectedArtist(artist.id);
                    }
                  }}
                >
                  <div className="artistImage">
                    <img className="originalImage" src={artist.image} />
                    {artist.selected == true && (
                      <div
                        className="material-icons check selected"
                        id={artist.id}
                      >
                        check_circle_outline
                      </div>
                    )}
                    {artist.selected == false && (
                      <div className="material-icons check" id={artist.id}>
                        check_circle_outline
                      </div>
                    )}
                  </div>
                  <div className="artistName">{artist.name}</div>
                </div>
              );
            })}
        </div>
        {document.querySelectorAll(".check.selected").length === 5 && (
          <div className="finishContainer">
            <button
              className="finishButton"
              onClick={() => {
                const final = [];
                const selectedEL = document.querySelectorAll(".check.selected");
                selectedEL.forEach((each_element) => {
                  final.push({ id: each_element.id });
                });
                dispatch(addTopArtists([...final]));
                history.push("/");
              }}
            >
              Finish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
