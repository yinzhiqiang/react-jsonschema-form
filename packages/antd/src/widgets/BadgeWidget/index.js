import React from "react";
import { Badge } from "antd";

const BadgeWidget = ({ options, value }) => {
  let badge;

  if (isNaN(value)) {
    badge = <Badge status={value} {...options} />;
  } else {
    badge = <Badge count={value} {...options} />;
  }

  return badge;
};

export default BadgeWidget;
