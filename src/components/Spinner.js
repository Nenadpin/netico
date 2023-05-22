import React from "react";

const Spinner = () => {
  return (
    <div
      className="modal"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Loading data...</h2>
    </div>
  );
};

export default Spinner;
