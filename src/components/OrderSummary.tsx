import { memo } from "react";
import { useSelector } from "react-redux";
import { getOrders } from "store/selectors/order";
import { OrderStatus, OrderType } from "types/order";

interface Props {
  className?: string;
  name: string;
}

const OrderSummary = ({ className, name }: Props) => {
  const orders = useSelector(getOrders(name));
  const confirmedOrders = orders.filter((o) => o.status === OrderStatus.DONE);
  const buyOrders = confirmedOrders.filter((o) => o.type === OrderType.BUY);
  const sellOrders = confirmedOrders.filter((o) => o.type === OrderType.SELL);
  const totalBuyQuantity = buyOrders.reduce((acc, val) => {
    return acc + val.quantity;
  }, 0);
  const totalSellQuantity = sellOrders.reduce((acc, val) => {
    return acc + val.quantity;
  }, 0);
  const totalStocksInHand = totalBuyQuantity - totalSellQuantity;
  const getSettled = buyOrders.reduce(
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
  );
  const { settled: totalSettled } = getSettled;
  const totalBuyAmount = buyOrders.reduce((acc, val) => {
    return acc + val.quantity * (val.actualPrice ?? 0);
  }, 0);
  const totalSellAmount = sellOrders.reduce((acc, val) => {
    return acc + val.quantity * (val.actualPrice ?? 0);
  }, 0);
  const totalStockAmount = totalBuyAmount - totalSettled;

  return (
    <div className={className}>
      <div>Stocks in hand: {totalStocksInHand}</div>
      <div>Total stock amount: {totalStockAmount}</div>
      <div>
        Average price:{" "}
        {totalStocksInHand === 0 ? 0 : totalStockAmount / totalStocksInHand}
      </div>
      <div>Profit/Loss: {totalSellAmount - totalSettled}</div>
    </div>
  );
};

export default memo(OrderSummary);
