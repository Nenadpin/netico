import React, { useContext } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ReportContext from "../Context";
import PrintGraph from "./PrintGraph";

const Listovi = ({ pageCount, no, ispPolja, ispCurr }) => {
  const { trafoStanica, elHist, prev } = useContext(ReportContext);
  const stanje = ["без напона", "зелено", "жуто", "црвено", "љубичасто"];
  const colors = ["white", "green", "yellow", "red", "purple"];
  return (
    <div className="report">
      <Header />
      <table
        style={{
          borderCollapse: "collapse",
          width: "18cm",
          marginTop: "0.5cm",
        }}
      >
        <colgroup>
          <col span="1" style={{ width: "2.5cm" }}></col>
          <col span="1" style={{ width: "1.5cm" }}></col>
          <col span="1" style={{ width: "2cm" }}></col>
          <col span="1" style={{ width: "2cm" }}></col>
          <col span="1" style={{ width: "3cm" }}></col>
          <col span="1" style={{ width: "1cm" }}></col>
          <col span="1" style={{ width: "1.5cm" }}></col>
          <col span="1" style={{ width: "1.5cm" }}></col>
          <col span="1" style={{ width: "1.5cm" }}></col>
          <col span="1" style={{ width: "1.5cm" }}></col>
        </colgroup>
        <tbody>
          <tr>
            <td
              colSpan={9}
              style={{
                color: "#0073ce",
                fontSize: "1rem",
                fontWeight: "600",
                borderRight: "1px solid black",
                borderBottom: "1px solid black",
              }}
            >
              ИСПИТНИ ЛИСТ {ispPolja[0].element[0].el_skraceno} ПОЉЕ{" "}
              {ispPolja[0].celija_oznaka}, ФАЗА{" "}
              {ispPolja[0].element[0].faza_opis}
            </td>
            <td
              style={{
                borderBottom: "1px solid black",
                backgroundColor:
                  colors[
                    ispPolja[0].element[0].history[elHist].stanje_izolacije
                  ],
              }}
            >
              {stanje[ispPolja[0].element[0].history[elHist].stanje_izolacije]}
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid black" }}>
            <td style={{ textAlign: "left", paddingLeft: "5px" }}>Елемент</td>
            <td style={{ border: "1px solid black" }}>
              {ispPolja[0].element[0].el_skraceno}
            </td>
            <td>Фаза</td>
            <td style={{ border: "1px solid black" }}>
              {ispPolja[0].element[0].faza_opis}
            </td>
            <td>Додатни опис</td>
            <td style={{ border: "1px solid black" }}>
              {ispPolja[0].element[0].posebna_pozicija}
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid black" }}>
            <td style={{ textAlign: "left", paddingLeft: "5px" }}>
              Произвођач
            </td>
            <td colSpan={3} style={{ border: "1px solid black" }}>
              {ispPolja[0].element[0]?.proizvodjac}
            </td>
            <td>Тип</td>
            <td colSpan={5} style={{ borderLeft: "1px solid black" }}>
              {ispPolja[0].element[0]?.tip}
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid black" }}>
            <td style={{ textAlign: "left", paddingLeft: "5px" }}>Објекат</td>
            <td
              colSpan={5}
              style={{ border: "1px solid black", fontWeight: "600" }}
            >
              ТС {trafoStanica?.naponski_nivo}kV {trafoStanica?.naziv}
            </td>
            <td>Напон</td>
            <td colSpan={3}>{ispPolja[0].napon.trim()} kV</td>
          </tr>
          <tr style={{ borderBottom: "1px solid black" }}>
            <td style={{ textAlign: "left", paddingLeft: "5px" }}>
              Назив поља
            </td>
            <td colSpan={5} style={{ border: "1px solid black" }}>
              {ispPolja[0].celija_naziv}
            </td>
            <td>Тип</td>
            <td>{ispPolja[0].tip_polja}</td>
            <td>Ознака</td>
            <td>{ispPolja[0].celija_oznaka}</td>
          </tr>
          <tr style={{ height: "20cm" }}>
            <td colSpan={10} style={{ border: "none" }}>
              <div
                style={{
                  display: "flex",
                  margin: "auto",
                  height: "18cm",
                  width: "14cm",
                }}
              >
                <PrintGraph
                  chartData={ispPolja[0].element[1].history[elHist].chart}
                />
              </div>
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid black" }}>
            <td colSpan={3}>{prev[elHist]?.rukovodilac}</td>
            <td colSpan={3}>{prev[elHist]?.izvrsilac1}</td>
            <td colSpan={4}>{prev[elHist]?.izvrsilac2}</td>
          </tr>
        </tbody>
      </table>
      <p
        style={{
          marginTop: "0.5cm",
          marginRight: "1.5cm",
          display: "flex",
          justifyContent: "right",
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            width: "2cm",
            border: "1px solid black",
          }}
        >
          Датум
        </span>
        <span
          style={{
            fontSize: "0.8rem",
            width: "2cm",
            border: "1px solid black",
          }}
        >
          {ispCurr[0].datum.replaceAll("/", ".")}
        </span>
      </p>
      <Footer str={(pageCount - no + 1).toString()} pageCount={pageCount} />
    </div>
  );
};

export default Listovi;
