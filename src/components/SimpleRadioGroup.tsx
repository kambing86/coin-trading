import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { ChangeEvent, memo, useCallback } from "react";

interface Props {
  options: OptionType[];
  value: string;
  onChange?: (value: string) => void;
}

const SimpleRadioGroup = ({ options, value, onChange }: Props) => {
  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value);
    },
    [onChange],
  );
  return (
    <RadioGroup value={value} onChange={onChangeHandler}>
      {options.map((o) => (
        <FormControlLabel
          key={o.value}
          value={o.value}
          control={<Radio />}
          label={o.label}
        />
      ))}
    </RadioGroup>
  );
};

export default memo(SimpleRadioGroup);
