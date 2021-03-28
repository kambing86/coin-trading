import { format } from "date-fns";
import useObservable from "hooks/helpers/useObservable";
import { MapPriceSession, getPriceSession$ } from "observables/price";
import { memo } from "react";
import { Chart } from "react-google-charts";

type GoogleDataType = [string, number, number, number, number];

function mapDataFunc(data: MapPriceSession<GoogleDataType>): GoogleDataType {
  const { time, open, close, min, max } = data;
  return [format(time, "HH:mm"), min, open, close, max];
}

interface Props {
  name: string;
  className?: string;
}

const CandlestickChart = ({ name, className }: Props) => {
  const [price] = useObservable(getPriceSession$(name, 10, mapDataFunc));
  const { data, error } = price;
  if (error) {
    return <>{error.toString()}</>;
  }
  const values = data?.map((d) => d.mapData);
  return (
    <div className={className}>
      {values && (
        <Chart
          width="100%"
          height="100%"
          chartType="CandlestickChart"
          loader={<div>Loading Chart</div>}
          data={[["minute", "a", "b", "c", "d"], ...values]}
          options={{
            legend: "none",
          }}
          rootProps={{ "data-testid": "1" }}
        />
      )}
    </div>
  );
};

export default memo(CandlestickChart);
