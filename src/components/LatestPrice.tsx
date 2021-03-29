import useObservable from "hooks/helpers/useObservable";
import { getPrice$ } from "observables/price";
import { memo } from "react";

interface Props {
  name: string;
}

const LatestPrice = ({ name }: Props) => {
  const [price] = useObservable(() => getPrice$(name));
  const { data } = price;
  if (!data) {
    return null;
  }
  return <div>{`${data.name}: ${data.price}`}</div>;
};

export default memo(LatestPrice);
