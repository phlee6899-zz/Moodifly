import history from "../history";
import { useDispatch, useSelector } from "react-redux";
import { addToken } from "../redux/action";
import "./Navbar.css";
import spotifyApi from "../Spotify";

export default function Navbar() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  return (
    <>
      <div className="navBar">
        <div className="logoContainer">
          <img
            src="/media/navbar-white-logo.png"
            onClick={() => history.push("/")}
          />
        </div>
        <div className="inner">
          <div className="menu">
            <ul>
              <li onClick={() => history.push("/mainrec")}>History</li>
              <li onClick={() => history.push("/sentimentrec")}>Text</li>
              <li onClick={() => history.push("/emojirec")}>Emoji</li>
            </ul>
          </div>
        </div>
        <div className="userSection">
          <div id="userInfo">
            {user && user.images[0] && (
              <img
                style={{
                  width: "45px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
                src={user.images[0].url}
                alt=""
              />
            )}
            {user && !user.images[0] && (
              <img
                style={{
                  width: "45px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
                src={"/media/no_user.png"}
                alt=""
              />
            )}
            <p className="userName">{user && user.display_name}</p>
          </div>
        </div>
      </div>
      {/* <div className="desc">
        <div className="mainDesc">Main Description</div>
        <div className="textDesc">Text Description</div>
        <div className="emojiDesc">Emoji Description</div>
      </div> */}
    </>
  );
}
