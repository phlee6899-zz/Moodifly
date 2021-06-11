import { authUrl } from "../LoginConfig";
import "./Login.css";
import video from "../media/Background.mp4";

export default function Login() {
  return (
    <div>
      <a href={authUrl}>
        <button className="loginButton">LOGIN WITH SPOTIFY</button>
      </a>
      <div className="LoginContainer">
        <video className="background" autoPlay loop muted>
          <source src={video} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
