import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { INIT } from "./actions";
import { getReducersMap } from "./reducers";

export function getReducers() {
  return combineReducers(getReducersMap());
}

export function getInitialState() {
  return getReducers()(undefined, INIT());
}

export default createStore(getReducers(), composeWithDevTools());
