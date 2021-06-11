import "./App.css";
import React from "react";
import Login from "./components/Login";
import Main from "./components/Main";
import { Router, Route } from "react-router-dom";
import NotFound from "./NotFound";
import SpotifyLogin from "./components/SpotifyLogin";
import history from "./history";

function App() {
  return (
    <Router history={history}>
      <Route path="/redirect" component={SpotifyLogin}></Route>
      <Route exact path="/" component={Main}></Route>
      <Route exact path="/login" component={Login}></Route>
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
