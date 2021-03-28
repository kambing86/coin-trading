import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import useObservable from "hooks/helpers/useObservable";
import { useOrder } from "hooks/useOrder";
import { startCase } from "lodash";
import { getPrice$ } from "observables/price";
import { memo, useCallback, useMemo, useState } from "react";
import { OrderTiming, OrderTrigger, OrderType } from "types/order";
import SimpleButton from "./SimpleButton";
import SimpleRadioGroup from "./SimpleRadioGroup";
import SimpleSelect from "./SimpleSelect";

const useStyles = makeStyles(() => ({
  reactSelect: {
    width: "100%",
  },
}));

interface Props {
  name: string;
  className?: string;
}

export const OrderPanel = ({ name, className }: Props) => {
  const classes = useStyles();
  const [price] = useObservable(getPrice$(name));
  const { data } = price;
  const [type, setType] = useState<OrderType>(OrderType.BUY);
  const typeOptions: OptionType[] = useMemo(
    () =>
      Object.keys(OrderType).map((val) => ({
        label: val,
        value: val,
      })),
    [],
  );
  const [timing, setTiming] = useState<OrderTiming>(OrderTiming.NOW);
  const timingOptions: OptionType[] = useMemo(
    () =>
      Object.keys(OrderTiming).map((val) => ({
        label: startCase(val.toLowerCase()),
        value: val,
      })),
    [],
  );
  const [trigger, setTrigger] = useState<OrderTrigger>(
    OrderTrigger.LESS_THAN_OR_EQUAL,
  );
  const triggerOptions: OptionType[] = useMemo(
    () =>
      Object.keys(OrderTrigger).map((val) => ({
        label: startCase(val.toLowerCase()),
        value: val,
      })),
    [],
  );

  const onChangeTypeHandler = useCallback((val: string) => {
    setType(val as OrderType);
    if (val === OrderType.BUY) {
      setTrigger(OrderTrigger.LESS_THAN_OR_EQUAL);
    } else {
      setTrigger(OrderTrigger.MORE_THAN_OR_EQUAL);
    }
  }, []);
  const onChangeTimingHandler = useCallback((val: string) => {
    setTiming(val as OrderTiming);
  }, []);
  const onChangeTriggerHandler = useCallback((val: string) => {
    setTrigger(val as OrderTrigger);
  }, []);

  const latestPrice = data?.price ?? 0;
  const { priceRef, quantityRef, onSubmit } = useOrder({
    name,
    type,
    timing,
    trigger,
    latestPrice,
  });

  return (
    <div className={className}>
      {data && <div>{`${data.name}: ${data.price}`}</div>}
      <SimpleSelect
        options={typeOptions}
        onChange={onChangeTypeHandler}
        className={classes.reactSelect}
        value={type}
      />
      <SimpleRadioGroup
        options={timingOptions}
        value={timing}
        onChange={onChangeTimingHandler}
      />
      {timing === OrderTiming.WHEN && (
        <div>
          <div>when price is</div>
          <SimpleSelect
            options={triggerOptions}
            onChange={onChangeTriggerHandler}
            className={classes.reactSelect}
            value={trigger}
          />
          <TextField inputRef={priceRef} defaultValue={latestPrice} />
        </div>
      )}
      <div>
        <div>for total of quantity</div>
        <TextField inputRef={quantityRef} defaultValue={1000} />
      </div>
      <SimpleButton text="Submit" onClick={onSubmit} />
    </div>
  );
};

export default memo(OrderPanel);
