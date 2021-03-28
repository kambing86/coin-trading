import { makeStyles } from "@material-ui/core/styles";
import { memo } from "react";
import CandlestickChart from "./CandlestickChart";
import OrderList from "./OrderList";
import { OrderPanel } from "./OrderPanel";
import OrderSummary from "./OrderSummary";

const useStyles = makeStyles(() => ({
  quarter: {
    width: "50%",
    height: "50%",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const coinName = "Coin A";
  return (
    <>
      <OrderPanel className={classes.quarter} name={coinName} />
      <CandlestickChart className={classes.quarter} name={coinName} />
      <OrderList className={classes.quarter} name={coinName} />
      <OrderSummary className={classes.quarter} name={coinName} />
    </>
  );
};

export default memo(Dashboard);
