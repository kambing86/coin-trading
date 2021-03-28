import { ActionType } from "typesafe-actions";
import * as actions from "./actions";
import { getInitialState } from ".";

export type GlobalState = ReturnType<typeof getInitialState>;
export type Action = ActionType<typeof actions>;
