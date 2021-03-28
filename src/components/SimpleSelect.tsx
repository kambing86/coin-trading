import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { ChangeEvent, memo, useCallback } from "react";

interface Props {
  label?: string;
  options: OptionType[];
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
}

const SimpleSelect = ({
  label,
  options,
  onChange,
  className,
  value,
}: Props) => {
  const onChangeHandler = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      onChange?.(event.target.value as string);
    },
    [onChange],
  );
  return (
    <FormControl className={className}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select value={value} onChange={onChangeHandler}>
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default memo(SimpleSelect);
