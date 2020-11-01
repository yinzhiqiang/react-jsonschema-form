import React from "react";
import { Slider } from "antd";

const SliderWidget = ({
    disabled = false,
    formContext = { readonlyAsDisabled: true },
    id,
    // label,
    multiple,
    onBlur,
    onChange,
    onFocus,
    options,
    readonly = false,
    schema,
    value,
}) => {
    const { readonlyAsDisabled = true } = formContext;

    return (
        <Slider
            id={id}
            name={id}
            disabled={disabled || (readonlyAsDisabled && readonly)}
            value={value}
            {...options}
        />
    );
};

export default SliderWidget;
