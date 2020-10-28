import React from "react";
import moment from "moment";

function timestamp2Str(timestamp, format) {
  return moment(timestamp).format(format);
}

const TimestampStringWidgit = ({ options, value }) => {
  let { format = "YYYY-MM-DD hh:mm:ss" } = options;
  return <div>{timestamp2Str(value, format)}</div>;
};

export default TimestampStringWidgit;
