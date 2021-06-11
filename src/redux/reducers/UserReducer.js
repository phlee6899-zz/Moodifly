import { ADD_USER, LOADING_FAILED_USER } from "../action";

const initState = {};

export default function userReducer(previousState = initState, action) {
  if (action.type === ADD_USER) {
    return { user: action.user };
  } else if (action.type === LOADING_FAILED_USER) {
    return { error: action.error };
  }
  return previousState;
}
