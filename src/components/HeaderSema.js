import React, { useContext } from "react";
import ReportContext from "../Context";
import logo from "../headerLogo.png";

const HeaderSema = ({ izvBr }) => {
  const { reports } = useContext(ReportContext);
  return (
    <div style={{ marginLeft: "1.5cm" }}>
      <div>
        <img src={logo} alt="logo" className="headerLogo"></img>
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: "39cm",
            justifyContent: "space-between",
            top: "1cm",
            border: "1px 0",
          }}
        >
          <span className="headerLogoText">Netico solutions</span>
          <span
            style={{
              textAlign: "right",
              marginLeft: "2.5cm",
              fontStyle: "italic",
            }}
          >
            Извештај број: {izvBr?.broj_izvestaja}
          </span>
        </div>
      </div>
      <hr
        style={{
          width: "39cm",
          height: "1px",
          zIndex: 1,
        }}
      ></hr>
    </div>
  );
};

export default HeaderSema;
