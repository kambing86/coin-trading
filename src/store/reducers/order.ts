import { ORDER_CANCELLED, ORDER_CREATED, ORDER_DONE } from "store/actions";
import { Action } from "store/types";
import { Order, OrderStatus } from "types/order";
import { getType } from "typesafe-actions";

type State = Readonly<Order[]>;

const initialState: State = [];

export function order(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(ORDER_CREATED):
      return [...state, action.payload];
    case getType(ORDER_DONE):
      return state.map((o) => {
        if (o.id === action.payload.id) {
          return {
            ...o,
            actualPrice: action.payload.actualPrice,
            status: OrderStatus.DONE,
            modifiedTime: action.payload.time,
          };
        }
        return o;
      });
    case getType(ORDER_CANCELLED):
      return state.map((o) => {
        if (o.id === action.payload.id) {
          return {
            ...o,
            status: OrderStatus.CANCELLED,
            modifiedTime: action.payload.time,
          };
        }
        return o;
      });
    default:
      return state;
  }
}
