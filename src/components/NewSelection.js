// import spotifyApi from "../Spotify";
// import history from "../history";
// import { useSelector } from "react-redux";
// import "rc-slider/assets/index.css";
// import "./NewSelection.css";
// import { useState, useEffect } from "react";

// export default function NewSelection(
//   countryPlaylistLoading,
//   countryPlaylist,
//   getCountryPlaylist,
//   user
// ) {
//   const token = useSelector((state) => {
//     return state.token;
//   });

//   spotifyApi.setAccessToken(token.token);

//   useEffect(() => {
//     if (user.user !== undefined) {
//       getCountryPlaylist(user.user.country);
//     }
//   }, []);

//   const playlist = useSelector((state) => state.data.countryPlaylist.content);
//   console.log(playlist);
//   const [artistList, setArtistList] = useState([]);

//   playlist.map((song) => {
//     song.artists.forEach((artist) => {
//       const name = artist.name;

//       spotifyApi.getArtist(artist.id).then((artist) => {
//         const imageUrl = artist.images[0].url;
//         const obj = { name: name, image: imageUrl };

//         if (!artistList.includes(obj)) {
//           setArtistList(...artistList, obj);
//         }
//       });
//     });
//   });

//   console.log(artistList);

//   return (
//     <div className="selectContainer">
//       <div className="selectionContainer">
//         <div className="selectionText">
//           We don't have enough information about your music taste.
//           <br />
//           <br /> Select 5 of your favorite artists!
//         </div>
//         <div className="selectionBox"></div>
//       </div>
//     </div>
//   );
// }
