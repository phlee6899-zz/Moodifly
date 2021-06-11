import { combineReducers } from "redux";
import tokenReducer from "./TokenReducer";
import loadingReducer from "./LoadingReducer";
import { connectRouter } from "connected-react-router";
import history from "../../history";
import userReducer from "./UserReducer";

const reducer = combineReducers({
  token: tokenReducer,
  user: userReducer,
  data: loadingReducer,
  router: connectRouter(history),
});

export default reducer;
