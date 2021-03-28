import { GlobalState } from "store/types";
import { OrderStatus, OrderType } from "types/order";

export const getTotalCanSell = (name: string) => (state: GlobalState) =>
  state.order
    .filter((order) => order.name === name)
    .reduce((acc, order) => {
      if (order.type === OrderType.BUY && order.status === OrderStatus.DONE) {
        return acc + order.quantity;
      } else if (
        order.type === OrderType.SELL &&
        order.status !== OrderStatus.CANCELLED
      ) {
        return acc - order.quantity;
      }
      return acc;
    }, 0);

export const getOrders = (name: string) => (state: GlobalState) =>
  state.order.filter((order) => order.name === name);
