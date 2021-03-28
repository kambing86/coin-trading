import Button from "@material-ui/core/Button";
import { memo } from "react";

interface Props {
  text: string;
  onClick?: () => void;
}

const SimpleButton = ({ text, onClick }: Props) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      {text}
    </Button>
  );
};

export default memo(SimpleButton);
