import React from "react";
import { Tag } from "antd";

const TagWidget = ({
  disabled = false,
  formContext = { readonlyAsDisabled: true },
  // label,
  multiple,
  onBlur,
  onChange,
  onFocus,
  options,
  readonly = false,
  hidden = false,
  schema,
  value,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  return (
    <Tag
    closable={!readonly}
    visible = {!hidden}
      {...options}
  >{value}</Tag>
  );
};

export default TagWidget;
