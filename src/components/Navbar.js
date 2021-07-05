import history from "../history";
import { useDispatch, useSelector } from "react-redux";
import { addToken } from "../redux/action";
import "./Navbar.css";
import spotifyApi from "../Spotify";

export default function Navbar() {
  function mouseoverAction(e) {
    const descSubmenu = document.querySelector(".navDesc");
    descSubmenu.classList.add("show");
    const mainDesc = document.querySelector(".mainDesc");
    // node.appendChild(textnode);
    switch (e.target.className) {
      case "historyLabel":
        mainDesc.innerText = "History Contents";
        break;
      case "textLabel":
        mainDesc.innerText = "Text Contents";
        break;
      case "emojiLabel":
        mainDesc.innerText = "Emoji Contents";
        break;
    }
  }

  function mouseLeaveAction(e) {
    const descSubmenu = document.querySelector(".navDesc");
    descSubmenu.classList.remove("show");
  }

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
              <li
                className="historyLabel"
                onClick={() => history.push("/mainrec")}
                onMouseOver={mouseoverAction}
                onMouseLeave={mouseLeaveAction}
              >
                History
              </li>
              <li
                className="textLabel"
                onClick={() => history.push("/sentimentrec")}
                onMouseOver={mouseoverAction}
                onMouseLeave={mouseLeaveAction}
              >
                Text
              </li>
              <li
                className="emojiLabel"
                onClick={() => history.push("/emojirec")}
                onMouseOver={mouseoverAction}
                onMouseLeave={mouseLeaveAction}
              >
                Emoji
              </li>
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
      <div className="navDesc">
        <div className="mainDesc">Main Description</div>
      </div>
    </>
  );
}
