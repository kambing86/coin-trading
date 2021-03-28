import { nanoid } from "nanoid";
import { executeOrder$ } from "observables/order";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ORDER_CREATED } from "store/actions";
import { getTotalCanSell } from "store/selectors/order";
import {
  Order,
  OrderStatus,
  OrderTiming,
  OrderTrigger,
  OrderType,
} from "types/order";

interface Options {
  name: string;
  type: OrderType;
  timing: OrderTiming;
  trigger: OrderTrigger;
  latestPrice: number;
}

export const useOrder = ({
  name,
  type,
  timing,
  trigger,
  latestPrice,
}: Options) => {
  const totalCanSell = useSelector(getTotalCanSell(name));
  const totalCanSellRef = useRef(totalCanSell);
  totalCanSellRef.current = totalCanSell;
  const nameRef = useRef(name);
  nameRef.current = name;
  const typeRef = useRef(type);
  typeRef.current = type;
  const timingRef = useRef(timing);
  timingRef.current = timing;
  const triggerRef = useRef(trigger);
  triggerRef.current = trigger;
  const latestPriceRef = useRef(latestPrice);
  latestPriceRef.current = latestPrice;
  const dispatch = useDispatch();

  const priceRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  const onSubmit = useCallback(() => {
    const submitPrice = Number(priceRef.current?.value ?? "0");
    const quantity = Number(quantityRef.current?.value ?? "0");
    if (typeRef.current === OrderType.SELL) {
      if (totalCanSellRef.current < quantity) {
        alert("Not enough stock to sell");
        return;
      }
    }
    const order: Order = {
      id: nanoid(),
      name: nameRef.current,
      type: typeRef.current,
      trigger:
        timingRef.current === OrderTiming.NOW ? undefined : triggerRef.current,
      price:
        timingRef.current === OrderTiming.NOW
          ? latestPriceRef.current
          : submitPrice,
      quantity: quantity,
      status:
        timingRef.current === OrderTiming.NOW
          ? OrderStatus.DONE
          : OrderStatus.PENDING,
      createdTime: new Date(),
    };
    if (timingRef.current === OrderTiming.NOW) {
      order.actualPrice = order.price;
    }
    dispatch(ORDER_CREATED(order));
    executeOrder$(order);
  }, [dispatch]);

  return { priceRef, quantityRef, onSubmit };
};
