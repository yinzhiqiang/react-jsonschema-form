import React from "react";
import { Switch } from "antd";

const BadgeWidgit = ({
  autofocus,
  disabled,
  formContext,
  id,
  // label,
  multiple,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  readonly,
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

export default BadgeWidgit;
