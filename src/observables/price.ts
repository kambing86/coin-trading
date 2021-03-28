import { format } from "date-fns";
import { GroupedObservable, Observable } from "rxjs";
import { groupBy, map, mergeMap, scan, share } from "rxjs/operators";

interface Options {
  intervalInMs: number;
  maxPriceChange: number;
}

const defaultOptions: Options = {
  intervalInMs: 1000,
  maxPriceChange: 0.01,
};

interface Price {
  name: string;
  price: number;
  time: Date;
}

export interface PriceSession<T> {
  key: string;
  name?: string;
  open?: number;
  close?: number;
  min?: number;
  max?: number;
  time?: Date;
  mapData?: T;
}

export type MapPriceSession<T = undefined> = Omit<
  Required<PriceSession<T>>,
  "mapData"
>;

const cacheObservable = new Map<string, Observable<Price>>();

export const getPrice$ = (name: string) => {
  if (!cacheObservable.has(name)) {
    const priceTick$ = new Observable<number>((subscriber) => {
      let price = Math.random() * 10000;
      subscriber.next(price);
      const _id = setInterval(() => {
        const changes = price * Math.random() * defaultOptions.maxPriceChange;
        price += changes * (Math.random() > 0.5 ? 1 : -1);
        subscriber.next(price);
      }, defaultOptions.intervalInMs);
      return () => {
        clearInterval(_id);
      };
    });
    cacheObservable.set(
      name,
      priceTick$.pipe(
        map((val) => ({ name, price: val, time: new Date() } as Price)),
        share(),
      ),
    );
  }
  return cacheObservable.get(name) as Observable<Price>;
};

export const getPriceSession$ = <T>(
  name: string,
  maxSession: number,
  mapFunc: (val: MapPriceSession<T>) => T,
) => {
  return getPrice$(name).pipe(
    groupBy((val) => format(val.time, "yyyyMMddHHmm")),
    mergeMap(mapToPriceSession(mapFunc)),
    scan((acc, val) => {
      const result = [...acc];
      if (result.length !== 0) {
        const lastIndex = result.length - 1;
        const lastItem = result[lastIndex];
        if (lastItem.key === val.key) {
          result.splice(lastIndex, 1, val);
        } else {
          result.push(val);
        }
      } else {
        result.push(val);
      }
      if (result.length > maxSession) {
        const removeCount = result.length - maxSession;
        result.splice(0, removeCount);
      }
      return result;
    }, [] as Required<PriceSession<T>>[]),
  );
};

const mapToPriceSession = <T>(mapFunc: (val: MapPriceSession<T>) => T) => {
  let closePrice: number | undefined;
  return (groupedPrice$: GroupedObservable<string, Price>) => {
    return groupedPrice$.pipe(
      scan(
        (priceSession, val) => {
          const { price, time } = val;
          const open = priceSession.open ?? closePrice ?? price;
          let max = priceSession.max;
          if (max === undefined || max < price) {
            max = price;
          }
          let min = priceSession.min;
          if (min === undefined || min > price) {
            min = price;
          }
          const result = {
            ...priceSession,
            name: val.name,
            open,
            close: price,
            max,
            min,
            time,
          } as Required<PriceSession<T>>;
          result.mapData = mapFunc(result);
          closePrice = price;
          return result;
        },
        { key: groupedPrice$.key } as PriceSession<T>,
      ),
    ) as Observable<Required<PriceSession<T>>>;
  };
};
