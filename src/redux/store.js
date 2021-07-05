import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers/reducer";
import history from "../history";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import { routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
};

const enhancedReducer = persistReducer(persistConfig, reducer);

const store = createStore(
  enhancedReducer,
  composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history)))
);

export default store;
