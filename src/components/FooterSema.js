import React, { useContext } from "react";
import ReportContext from "../Context";

const FooterSema = ({ str, pageCount, sifra }) => {
  return (
    <div
      style={{
        position: "absolute",
        display: "block",
        top: "28cm",
        left: "1.5cm",
      }}
    >
      <hr
        style={{
          width: "39cm",
          height: "1px",
          borderBottom: "1px",
        }}
      ></hr>
      <p
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#74bc74",
          fontStyle: "italic",
          fontFamily: "Arial",
          marginTop: "0cm",
        }}
      >
        ISP{sifra}
        {pageCount ? (
          <span
            style={{ color: "black", fontStyle: "normal", fontFamily: "Arial" }}
          >
            Страница <strong>{str}</strong> od <strong>{pageCount}</strong>
          </span>
        ) : null}
      </p>
    </div>
  );
};

export default FooterSema;
