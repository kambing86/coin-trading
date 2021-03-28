import { Order } from "types/order";
import { createAction } from "typesafe-actions";

export const ORDER_CREATED = createAction("ORDER_CREATED")<Order>();

export const ORDER_DONE = createAction("ORDER_DONE")<{
  id: string;
  actualPrice: number;
  time: Date;
}>();

export const ORDER_CANCELLED = createAction("ORDER_CANCELLED")<{
  id: string;
  time: Date;
}>();
