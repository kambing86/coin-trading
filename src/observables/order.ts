import { Subject } from "rxjs";
import {
  combineLatestWith,
  filter,
  map,
  mergeMap,
  scan,
  shareReplay,
  startWith,
  takeUntil,
  tap,
} from "rxjs/operators";
import store from "store";
import { ORDER_DONE } from "store/actions";
import { Order, OrderTrigger, OrderType } from "types/order";
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

export const getSummary$ = () => {
  const orderInput$ = new Subject<Order>();
  const totalOrder$ = orderInput$.pipe(scan((acc) => acc + 1, 0));
  const buyOrders$ = orderInput$.pipe(
    filter((o) => o.type === OrderType.BUY),
    shareReplay(),
  );
  const sellOrders$ = orderInput$.pipe(
    filter((o) => o.type === OrderType.SELL),
  );
  const totalBuyQuantity$ = buyOrders$.pipe(
    scan((acc, val) => {
      return acc + val.quantity;
    }, 0),
  );
  const totalSellQuantity$ = sellOrders$.pipe(
    scan((acc, val) => {
      return acc + val.quantity;
    }, 0),
    startWith(0),
  );
  const totalStocksInHand$ = totalBuyQuantity$.pipe(
    combineLatestWith(totalSellQuantity$),
    map(
      ([totalBuyQuantity, totalSellQuantity]) =>
        totalBuyQuantity - totalSellQuantity,
    ),
    startWith(0),
  );

  const totalBuyAmount$ = buyOrders$.pipe(
    scan((acc, val) => {
      return acc + val.quantity * (val.actualPrice ?? 0);
    }, 0),
  );
  const totalSellAmount$ = sellOrders$.pipe(
    scan((acc, val) => {
      return acc + val.quantity * (val.actualPrice ?? 0);
    }, 0),
    startWith(0),
  );
  const totalSettled$ = totalSellQuantity$.pipe(
    mergeMap((totalSellQuantity) =>
      buyOrders$.pipe(
        scan(
          (acc, val) => {
            const { sellQty, settled } = acc;
            if (sellQty === 0) return acc;
            let qty = val.quantity;
            if (sellQty < val.quantity) {
              qty = sellQty;
            }
            let sellQtyLeft = sellQty - val.quantity;
            if (sellQtyLeft < 0) {
              sellQtyLeft = 0;
            }
            return {
              sellQty: sellQtyLeft,
              settled: settled + qty * (val.actualPrice ?? 0),
            };
          },
          { sellQty: totalSellQuantity, settled: 0 },
        ),
      ),
    ),
    map(({ settled }) => settled),
    startWith(0),
  );
  const totalStockAmount$ = totalBuyAmount$.pipe(
    combineLatestWith(totalSettled$),
    map(([totalBuyAmount, totalSettled]) => totalBuyAmount - totalSettled),
    startWith(0),
  );

  return {
    orderInput$,
    totalOrder$,
    summary$: totalStocksInHand$.pipe(
      combineLatestWith(totalStockAmount$, totalSellAmount$, totalSettled$),
      map(
        ([
          totalStocksInHand,
          totalStockAmount,
          totalSellAmount,
          totalSettled,
        ]) => ({
          totalStocksInHand,
          totalStockAmount,
          totalSellAmount,
          totalSettled,
        }),
      ),
    ),
  };
};
