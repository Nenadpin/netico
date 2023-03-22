import React from "react";
import Footer from "./Footer";

const Sadrzaj = ({ napIzv }) => {
  return (
    <div id="pg3" className="report">
      <p
        style={{
          display: "block",
          textAlign: "center",
          fontFamily: "Arial",
          fontSize: "1.1rem",
          color: "#0073ce",
          marginTop: "2cm",
        }}
      >
        САДРЖАЈ
      </p>
      <table
        className="tbl"
        style={{
          width: "18cm",
          border: "none",
        }}
      >
        <colgroup>
          <col span="1" style={{ width: "5%" }}></col>
          <col span="1"></col>
          <col span="1" style={{ width: "5%" }}></col>
        </colgroup>
        <tbody>
          <tr>
            <td style={{ textAlign: "left" }}>1 </td>
            <td style={{ textAlign: "left" }}>
              УВОД . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
              . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
              . . . . . . . .
            </td>
            <td style={{ textAlign: "right" }}>4</td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>2 </td>
            <td style={{ textAlign: "left" }}>
              ЕЛЕКТРИЧНА ШЕМА ТРАНСФОРМАТОРСКЕ СТАНИЦЕ . . . . . . . . . . . . .
              . . . . . . . . . . . . . . . .
            </td>
            <td style={{ textAlign: "right" }}>5</td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>3 </td>
            <td style={{ textAlign: "left" }}>
              ПОДАЦИ О МЕРНИМ ИНСТРУМЕНТИМА И ОПРЕМИ . . . . . . . . . . . . . .
              . . . . . . . . . . . . . . . . .
            </td>
            <td style={{ textAlign: "right" }}>6</td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>4 </td>
            <td style={{ textAlign: "left" }}>
              ОПИС ИСПИТИВАЊА . . . . . . . . . . . . . . . . . . . . . . . . .
              . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            </td>
            <td style={{ textAlign: "right" }}>6</td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>5 </td>
            <td style={{ textAlign: "left" }}>
              РЕЗУЛТАТИ ИСПИТИВАЊА . . . . . . . . . . . . . . . . . . . . . . .
              . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            </td>
            <td style={{ textAlign: "right" }}>7</td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>6 </td>
            <td style={{ textAlign: "left" }}>
              ЗАКЉУЧАК - МИШЉЕЊЕ И ТУМАЧЕЊЕ . . . . . . . . . . . . . . . . . .
              . . . . . . . . . . . . . . . . . . . . . . . .
            </td>
            <td style={{ textAlign: "right" }}>14</td>
          </tr>
          {Object.keys(napIzv).map((n, index) => {
            return (
              <tr key={index}>
                <td style={{ textAlign: "right", paddingRight: "10px" }}>
                  6.{index + 1}
                </td>
                <td style={{ textAlign: "left" }}>
                  Напонски ниво {n} kV . . . . . . . . . . . . . . . . . . . . .
                  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                  . . . . . .
                </td>
                <td style={{ textAlign: "right" }}>{14 + index}</td>
              </tr>
            );
          })}
          <tr>
            <td style={{ textAlign: "left" }}>7 </td>
            <td style={{ textAlign: "left" }}>
              ПРИЛОЗИ . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
              . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
              . . . . . .
            </td>
            <td style={{ textAlign: "right" }}>
              {14 + Object.keys(napIzv).length}
            </td>
          </tr>
        </tbody>
      </table>
      <Footer />
    </div>
  );
};

export default Sadrzaj;
