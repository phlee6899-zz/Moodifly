import { authUrl } from "../../LoginConfig";
import "./Login.css";
import TextLoop from "react-text-loop";
// import video from "../media/Background.mp4";

export default function Login() {
  return (
    <div className="Container Login">
      <div className="loginMain">
        <div className="logoContainer">
          <img src="/media/white-vertical-logo.png"></img>
        </div>
        <div className="textLoop">
          Music Tailored From
          <TextLoop interval={2000}>
            <span>Emojis</span>
            <span>Sentiment Analysis</span>
            <span>Listening History</span>
          </TextLoop>{" "}
        </div>
      </div>
      <div className="buttonContainer">
        <a href={authUrl}>
          <img className="icon" src="/media/spotify-icon.png"></img>
          <p>LOGIN WITH SPOTIFY</p>
        </a>
      </div>
      {/* <div className="LoginContainer">
        <div className="backgroundCover"></div>
        <video className="background" autoPlay loop muted>
          <source src={video} type="video/mp4" />
        </video>
      </div> */}
    </div>
  );
}
