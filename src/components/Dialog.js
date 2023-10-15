import React, { useState, useContext } from "react";
import ReportContext from "../Context";

const Dialog = () => {
  const { message, setMessage, setModal } = useContext(ReportContext);
  const [showDialog, setShowDialog] = useState(true);

  const handleClose = () => {
    setShowDialog(false);
    setModal(false);
    setMessage(null);
  };

  return (
    <>
      <div className="modal"></div>
      {showDialog && (
        <div className="dialog">
          <h2>Netico Alert!</h2>
          <h4 style={{ marginBottom: "1rem" }}>{message}</h4>
          <button
            className="block-btn"
            onClick={handleClose}
            style={{ marginLeft: "0" }}
          >
            OK
          </button>
        </div>
      )}
    </>
  );
};

export default Dialog;
