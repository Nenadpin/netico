import React, { useContext } from "react";
import ReportContext from "../Context";
import logo from "../headerLogo.png";

const Header = () => {
  const { reports, elHist } = useContext(ReportContext);
  return (
    <div>
      <div>
        <img src={logo} alt="logo" className="headerLogo"></img>
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: "18cm",
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
            Извештај број: {reports[elHist]?.broj_izvestaja}
          </span>
        </div>
      </div>
      <hr
        style={{
          width: "18cm",
          height: "1px",
        }}
      ></hr>
    </div>
  );
};

export default Header;