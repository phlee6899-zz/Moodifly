import "./App.css";
import React from "react";
import Login from "./components/Login";
import Main from "./components/Main";
import MainRecommendation from "./components/MainRecommendation";
import EmojiRecommendation from "./components/EmojiRecommendation";
import SentimentRecommendation from "./components/SentimentRecommendation";
import { Router, Route } from "react-router-dom";
import SpotifyLogin from "./components/SpotifyLogin";
import history from "./history";

function App() {
  return (
    <Router history={history}>
      <Route path="/redirect" component={SpotifyLogin} />
      <Route exact path="/" component={Main} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/history" component={MainRecommendation} />
      <Route exact path="/emoji" component={EmojiRecommendation} />
      <Route exact path="/sentiment" component={SentimentRecommendation} />
      {/* <Route component={NotFound}></Route> */}
    </Router>
    // <BrowserRouter>
    //   <Switch>
    //     <Route path="/redirect" component={SpotifyLogin}></Route>
    //     <Route
    //       exact
    //       path="/"
    //       render={(props) => {
    //         return props.location.state !== undefined ? (
    //           <Main
    //             spotify={spotifyApi}
    //             token={props.location.state.token}
    //           ></Main>
    //         ) : (
    //           <Login />
    //         );
    //       }}
    //     ></Route>
    //     <Route component={NotFound}></Route>
    //   </Switch>
    // </BrowserRouter>
  );
}

export default App;
