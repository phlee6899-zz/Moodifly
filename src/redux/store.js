import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers/reducer";
import history from "../history";
import { routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history)))
);

export default store;
