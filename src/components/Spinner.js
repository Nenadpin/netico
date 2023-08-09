import React from "react";

const Spinner = ({ message }) => {
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
      <h2>{message ? message : "Loading data..."}</h2>
    </div>
  );
};

export default Spinner;
