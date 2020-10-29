import React from "react";
import { Switch } from "antd";

const SwitchWidget = ({
  autofocus = false,
  disabled = false,
  formContext = { readonlyAsDisabled: true },
  id,
  // label,
  multiple,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  readonly = false,
  required,
  schema,
  value,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  return (
    <Switch
      autoFocus={autofocus}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      defaultChecked={value}
      {...options}
    />
  );
};

export default SwitchWidget;
