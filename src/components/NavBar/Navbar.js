import history from "../../history";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToken } from "../../redux/action";
import "./Navbar.css";
import spotifyApi from "../../Spotify";

export default function Navbar() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function mouseoverAction(e) {
    const descSubmenu = document.querySelector(".navDesc");
    descSubmenu.classList.add("show");
    const mainDesc = document.querySelector(".mainDesc");
    // node.appendChild(textnode);
    switch (e.target.className) {
      case "historyLabel":
        setTitle("Listening History Based Recommendation");
        setContent(
          "We know how much you love your favorite artists and tracks. On Moodifly, we recommend personalized music based on your music taste. You can also use our slider feature that allows you to filter the recommendation based on values like energy and danceability."
        );
        break;
      case "textLabel":
        setTitle("Text Sentiment Based Recommendation");
        setContent(
          "No matter what your mood is we will be there for you. Write down your thoughts, feelings, or whatever that is going through your head. Moodifly will recommend a song that you want to hear right at this moment using our real-time text sentiment analyis."
        );
        break;
      case "emojiLabel":
        setTitle("Emoji Based Recommendation");
        setContent(
          "Now, more emojis are used than ever before and we recognize emoji's crucial role in filling the emotional cues missing from our typed conversations. On Moodifly, users can select a single emoji or a chain of emojis for a personalized recommendation based on the sentiment of the selection."
        );
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
                onClick={() => history.push("/history")}
                onMouseOver={mouseoverAction}
                onMouseLeave={mouseLeaveAction}
              >
                History
              </li>
              <li
                className="textLabel"
                onClick={() => history.push("/sentiment")}
                onMouseOver={mouseoverAction}
                onMouseLeave={mouseLeaveAction}
              >
                Text
              </li>
              <li
                className="emojiLabel"
                onClick={() => history.push("/emoji")}
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
                  width: "40px",
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
        <div className="title">{title}</div>
        <div className="mainDesc">{content}</div>
      </div>
    </>
  );
}
