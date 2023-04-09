import React, { useContext } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ReportContext from "../Context";
import PrintGraph from "./PrintGraph";

const Listovi = ({ pageCount, no, ispPolja, ispCurr, izvBr }) => {
  const { trafoStanica, history, sifraIspitivanja } = useContext(ReportContext);
  const stanje = ["без напона", "зелено", "жуто", "црвено", "љубичасто"];
  const colors = ["white", "green", "yellow", "red", "purple"];
  let strNo = pageCount - no + 1;

  return (
    <>
      {ispPolja
        ? ispPolja.map((polje) =>
            polje.element.map((ele, ie) => {
              if (history[ele.moja_sifra])
                return (
                  <div key={ie} className="report">
                    <Header izvBr={{ izvBr }} />
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
                            ИСПИТНИ ЛИСТ {ele.el_skraceno} ПОЉЕ{" "}
                            {polje.celija_oznaka}, ФАЗА {ele.faza_opis}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid black",
                              backgroundColor: colors[history[ele.moja_sifra]],
                            }}
                          >
                            {stanje[history[ele.moja_sifra]]}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid black" }}>
                          <td style={{ textAlign: "left", paddingLeft: "5px" }}>
                            Елемент
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {ele.el_skraceno}
                          </td>
                          <td>Фаза</td>
                          <td style={{ border: "1px solid black" }}>
                            {ele.faza_opis}
                          </td>
                          <td>Додатни опис</td>
                          <td style={{ border: "1px solid black" }}>
                            {ele.posebna_pozicija}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid black" }}>
                          <td style={{ textAlign: "left", paddingLeft: "5px" }}>
                            Произвођач
                          </td>
                          <td colSpan={3} style={{ border: "1px solid black" }}>
                            {ele?.proizvodjac}
                          </td>
                          <td>Тип</td>
                          <td
                            colSpan={5}
                            style={{ borderLeft: "1px solid black" }}
                          >
                            {ele?.tip}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid black" }}>
                          <td style={{ textAlign: "left", paddingLeft: "5px" }}>
                            Објекат
                          </td>
                          <td
                            colSpan={5}
                            style={{
                              border: "1px solid black",
                              fontWeight: "600",
                            }}
                          >
                            ТС {trafoStanica?.naponski_nivo}kV{" "}
                            {trafoStanica?.naziv}
                          </td>
                          <td>Напон</td>
                          <td colSpan={3}>{polje.napon.trim()} kV</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid black" }}>
                          <td style={{ textAlign: "left", paddingLeft: "5px" }}>
                            Назив поља
                          </td>
                          <td colSpan={5} style={{ border: "1px solid black" }}>
                            {polje.celija_naziv}
                          </td>
                          <td>Тип</td>
                          <td>{polje.tip_polja}</td>
                          <td>Ознака</td>
                          <td>{polje.celija_oznaka}</td>
                        </tr>
                        <tr style={{ height: "20cm" }}>
                          <td colSpan={10} style={{ border: "none" }}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "auto",
                                height: "18cm",
                                width: "14cm",
                              }}
                            >
                              <PrintGraph
                                chartData={
                                  ele.history.filter(
                                    (h) =>
                                      h.sifra_ispitivanja ===
                                      "ISP" + sifraIspitivanja
                                  )[0]?.chart
                                }
                              />
                            </div>
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid black" }}>
                          <td colSpan={3}>{ispCurr.rukovodilac}</td>
                          <td colSpan={3}>{ispCurr?.izvrsilac1}</td>
                          <td colSpan={4}>{ispCurr?.izvrsilac2}</td>
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
                    <Footer str={(strNo++).toString()} pageCount={pageCount} />
                  </div>
                );
              else return null;
            })
          )
        : null}
    </>
  );
};

export default Listovi;
