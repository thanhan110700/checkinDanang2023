import React from "react";
import "./index.css"

const Container = ({ children, ...props }) => {
  return (
    <div className="container" {...props}>
      {children}
    </div>
  );
};

export default Container;
