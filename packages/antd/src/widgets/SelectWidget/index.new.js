/* eslint-disable no-else-return */
import React from "react";

import { utils } from "@rjsf/core";
import Select from "antd/lib/select";

const { asNumber, guessType } = utils;

const SELECT_STYLE = {
  width: "100%",
};

const nums = new Set(["number", "integer"]);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema, value) => {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;

  if (value === "") {
    return undefined;
  } else if (type === "array" && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every((x) => guessType(x) === "number")) {
      return asNumber(value);
    } else if (schema.enum.every((x) => guessType(x) === "boolean")) {
      return value === "true";
    }
  }

  return value;
};

const SelectWidget = ({
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

  const { enumOptions, enumDisabled, restricted = false } = options;

  const handleChange = (nextValue) => onChange(processValue(schema, nextValue));

  const handleBlur = () => onBlur(id, processValue(schema, value));

  const handleFocus = () => onFocus(id, processValue(schema, value));

  const getPopupContainer = (node) => node.parentNode;

  //restricted value
  let currentValue = value;
  if (enumOptions && restricted) {
    if (Array.isArray(currentValue)) {
      currentValue = currentValue.filter((element) => {
        for (let index = 0; index < enumOptions.length; index++) {
          const { label, value: optionValue } = enumOptions[index];
          if (element === optionValue) {
            return true;
          }
        }
        return false;
      });

      if (currentValue.length < 1) {
        if (required && schema.default) {
          currentValue.push(schema.default);
        }
      }
    } else {
      let hasRestrictedValue = false;
      if (currentValue) {
        enumOptions.forEach(({ label, value: optionValue }) => {
          if (currentValue === optionValue) {
            hasRestrictedValue = true;
          }
        });
      }

      if (!hasRestrictedValue) {
        if (required && schema.default) {
          currentValue = schema.default;
        } else {
          currentValue = undefined;
        }
      }
    }
  }

  const stringify = (currentValue) => {
    return Array.isArray(currentValue)
      ? currentValue.map(String)
      : String(currentValue);
  };

  return (
    <Select
      autoFocus={autofocus}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      getPopupContainer={getPopupContainer}
      id={id}
      mode={typeof multiple !== "undefined" ? "multiple" : undefined}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      style={SELECT_STYLE}
      value={
        typeof currentValue !== "undefined"
          ? stringify(currentValue)
          : undefined
      }>
      {enumOptions.map(({ value: optionValue, label: optionLabel }) => (
        <Select.Option
          disabled={enumDisabled && enumDisabled.indexOf(value) !== -1}
          key={String(optionValue)}
          value={String(optionValue)}>
          {optionLabel}
        </Select.Option>
      ))}
    </Select>
  );
};

SelectWidget.defaultProps = {
  formContext: {},
};

export default SelectWidget;
