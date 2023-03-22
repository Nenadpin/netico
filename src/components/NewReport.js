import { useContext, useState, useRef } from "react";
import ReportContext from "../Context";

const NewReport = () => {
  const { polja, trafoStanica, sifraIspitivanja, history } =
    useContext(ReportContext);
  const [currentEl, setCurrentEl] = useState(null);
  const colors = ["Без напона", "Зелено", "Жуто", "Црвено", "Љубичасто"];
  let r_br = 0;
  const dir_name =
    "https://nenadst.000webhostapp.com/slike/ISP" + sifraIspitivanja + "/";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", columnGap: "50px" }}
    >
      <table style={{ border: "none" }}>
        <thead>
          <tr style={{ border: "none" }}>
            <td style={{ height: "50px", border: "none" }}>
              <span className="header-space">Header</span>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr style={{ border: "none" }}>
            <td style={{ border: "none" }}>
              <div>
                {polja ? (
                  <div className="newContainer" style={{ marginLeft: "1cm" }}>
                    {trafoStanica.napon.map((el, index) => {
                      return (
                        <table className="tbl" style={{ marginTop: "0" }}>
                          <caption
                            key={index}
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: "bold",
                              padding: "10px",
                            }}
                          >
                            Поља са напоном {el} kV
                          </caption>
                          <colgroup>
                            <col span="1" style={{ width: "5%" }}></col>
                            <col span="1" style={{ width: "35%" }}></col>
                            <col span="1" style={{ width: "15%" }}></col>
                            <col span="1" style={{ width: "25%" }}></col>
                            <col span="1" style={{ width: "20%" }}></col>
                          </colgroup>
                          <thead>
                            <tr>
                              <th>Р.бр.</th>
                              <th>Поље</th>
                              <th>Елемент/Фаза</th>
                              <th>Произвођач-Тип</th>
                              <th>Стање изолације</th>
                            </tr>
                          </thead>
                          <tbody>
                            {polja
                              .filter((x) => {
                                r_br = 1;
                                return (
                                  parseInt(x.napon) === parseInt(el) &&
                                  x.element
                                );
                              })
                              .map((polje, idxP) => {
                                return polje.element.map((elpn, idxE) => {
                                  return (
                                    <tr style={{ border: "1px solid black" }}>
                                      <td
                                        key={idxP}
                                        style={{ border: "1px solid black" }}
                                      >
                                        {r_br++}
                                      </td>
                                      {idxE === 0 ? (
                                        <td
                                          rowSpan={polje.element.length}
                                          className="page-break"
                                        >
                                          {polje.celija_oznaka},{" "}
                                          {polje.celija_naziv}
                                        </td>
                                      ) : null}
                                      <td style={{ border: "1px solid black" }}>
                                        {elpn.el_skraceno.trim()},{" "}
                                        {elpn.faza_opis}
                                      </td>
                                      <td style={{ border: "1px solid black" }}>
                                        {elpn.tip}
                                      </td>
                                      <td
                                        onClick={() => {
                                          console.log(elpn);
                                          setCurrentEl({
                                            element: elpn.el_skraceno,
                                            naponEl: el,
                                            oznakaEl: polje.celija_oznaka,
                                            fazaEl: elpn.faza_opis,
                                            izolacija: history[elpn.moja_sifra],
                                            slika: dir_name + elpn.us,
                                            slika2: dir_name + elpn.ut,
                                          });
                                        }}
                                        style={{
                                          backgroundColor:
                                            history[elpn.moja_sifra] === 1
                                              ? "green"
                                              : history[elpn.moja_sifra] === 2
                                              ? "yellow"
                                              : history[elpn.moja_sifra] === 3
                                              ? "red"
                                              : history[elpn.moja_sifra] === 4
                                              ? "purple"
                                              : "white",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {colors[history[elpn.moja_sifra]]}
                                      </td>
                                    </tr>
                                  );
                                });
                              })}
                          </tbody>
                        </table>
                      );
                    })}
                  </div>
                ) : null}
                {currentEl ? (
                  <div className="diagram">
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "700px 100px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "arial",
                          fontSize: "large",
                          color: "#0073ce",
                        }}
                      >
                        {currentEl
                          ? `ИСПИТНИ ЛИСТ ${currentEl.element}, ${currentEl.naponEl}, ПОЉЕ ${currentEl.oznakaEl}, ФАЗА ${currentEl.fazaEl}`
                          : null}
                      </div>
                      <div
                        style={{
                          backgroundColor:
                            currentEl.izolacija === 1
                              ? "green"
                              : currentEl.izolacija === 2
                              ? "yellow"
                              : currentEl.izolacija === 3
                              ? "red"
                              : "white",
                        }}
                      >
                        {colors[currentEl.izolacija]}
                      </div>
                    </div>
                    <img
                      src={currentEl.slika}
                      style={{
                        display: "block",
                        width: "800px",
                        height: "300px",
                      }}
                      alt="ultrazvucno ispitivanje"
                    ></img>
                    <img
                      src={currentEl.slika2}
                      style={{
                        display: "block",
                        width: "800px",
                        height: "300px",
                      }}
                      alt="ultrazvucno ispitivanje"
                    ></img>
                  </div>
                ) : null}
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr style={{ border: "none" }}>
            <td style={{ height: "50px", border: "none" }}>
              <div className="footer-space">&nbsp;</div>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="footer">Footer</div>
    </div>
  );
};

export default NewReport;
