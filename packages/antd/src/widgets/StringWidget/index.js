import React from "react";

const StringWidget = ({value}) => {
      return (
      <div>
          {String(value)}
      </div>
    );
}

export default StringWidget;