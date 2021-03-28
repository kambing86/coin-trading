import Button from "@material-ui/core/Button";
import { cancelEventMap } from "observables/order";
import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { ORDER_CANCELLED } from "store/actions";
import { Order, OrderStatus } from "types/order";

interface Props {
  data: Order;
}

const CancelOrderButton = ({ data }: Props) => {
  const dispatch = useDispatch();
  const clickHandler = useCallback(() => {
    cancelEventMap.get(data.id)?.next();
    dispatch(ORDER_CANCELLED({ id: data.id, time: new Date() }));
  }, [data, dispatch]);
  if (data.status !== OrderStatus.PENDING) {
    // passing null will cause error in ag-grid
    // https://github.com/ag-grid/ag-grid/issues/3222#issuecomment-524034219
    return <div></div>;
  }
  return (
    <Button variant="contained" color="secondary" onClick={clickHandler}>
      Cancel
    </Button>
  );
};

export default memo(CancelOrderButton);
