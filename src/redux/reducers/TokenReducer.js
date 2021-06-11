import { ADD_TOKEN } from "../action";

const initState = "";

export default function tokenReducer(previousState = initState, action) {
  if (action.type === ADD_TOKEN) {
    return { token: action.token };
  }
  return previousState;
}
