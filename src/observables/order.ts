import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import store from "store";
import { ORDER_DONE } from "store/actions";
import { Order, OrderTrigger } from "types/order";
import { getPrice$ } from "./price";

export const cancelEventMap = new Map<string, Subject<void>>();

export const executeOrder$ = (order: Order) => {
  const terminate = new Subject<void>();
  terminate.pipe(
    tap(() => {
      cancelEventMap.delete(order.id);
    }),
  );
  cancelEventMap.set(order.id, terminate);
  getPrice$(order.name)
    .pipe(takeUntil(terminate))
    .subscribe((current) => {
      if (
        current.price >= order.price &&
        order.trigger === OrderTrigger.MORE_THAN_OR_EQUAL
      ) {
        store.dispatch(
          ORDER_DONE({
            id: order.id,
            actualPrice: current.price,
            time: new Date(),
          }),
        );
        terminate.next();
      } else if (
        current.price <= order.price &&
        order.trigger === OrderTrigger.LESS_THAN_OR_EQUAL
      ) {
        store.dispatch(
          ORDER_DONE({
            id: order.id,
            actualPrice: current.price,
            time: new Date(),
          }),
        );
        terminate.next();
      }
    });
};
