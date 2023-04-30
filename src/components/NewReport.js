import { useContext, useState } from "react";
import ViewGraph from "./ViewGraph";
import ReportContext from "../Context";

const NewReport = () => {
  const { polja, trafoStanica, history, tipPrikaza } =
    useContext(ReportContext);
  const [currentEl, setCurrentEl] = useState(null);
  const [chartData, setChartData] = useState(null);
  const colors = ["Без напона", "Зелено", "Жуто", "Црвено", "Љубичасто"];
  let r_br = 0;

  const view = (h) => {
    let labelS = [0];
    for (let i = 0; i < 500; i++) {
      labelS.push((500 + i * 19) / 10);
    }
    let labelT = [-12];
    for (let i = 0; i < 600; i++) {
      labelT.push((-100 + i) / 10);
    }
    let ch = {
      lub: "",
      luf: "",
      lug: "",
      luh: "",
      lt1: "",
      lt2: "",
      lt3: "",
      lt4: "",
      us: {
        label: labelS,
        dataF: [],
        dataG: [],
        dataH: [],
        dataB: [],
      },
      ut: {
        label: labelT,
        data1: [],
        data2: [],
        data3: [],
        data4: [],
      },
    };
    ch.us.label = labelS;
    ch.ut.label = labelT;
    if (h.length) {
      ch.lub = h[0].sifra_ispitivanja;
      ch.lt1 = h[0].sifra_ispitivanja;
      ch.us.dataB = h[0].chart?.us.dataF;
      ch.ut.data1 = h[0].chart?.ut.data;
    }
    if (h.length === 2) {
      ch.luf = h[1].sifra_ispitivanja;
      ch.lt2 = h[1].sifra_ispitivanja;
      ch.us.dataF = h[1].chart?.us.dataF;
      ch.ut.data2 = h[1].chart?.ut.data;
    }
    if (h.length === 3) {
      ch.lug = h[2].sifra_ispitivanja;
      ch.lt3 = h[2].sifra_ispitivanja;
      ch.us.dataG = h[2].chart?.us.dataF;
      ch.ut.data3 = h[2].chart?.ut.data;
    }
    if (h.length === 4) {
      ch.luh = h[3].sifra_ispitivanja;
      ch.lt4 = h[3].sifra_ispitivanja;
      ch.us.dataH = h[3].chart?.us.dataF;
      ch.ut.data4 = h[3].chart?.ut.data;
    }
    setChartData(ch);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", columnGap: "50px" }}
    >
      {polja && tipPrikaza === 1 ? (
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
                      return parseInt(x.napon) === parseInt(el) && x.element;
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
                                {polje.celija_oznaka}, {polje.celija_naziv}
                              </td>
                            ) : null}
                            <td style={{ border: "1px solid black" }}>
                              {elpn.el_skraceno.trim()}, {elpn.faza_opis}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {elpn.tip}
                            </td>
                            <td
                              onClick={() => {
                                setCurrentEl({
                                  element: elpn.el_skraceno,
                                  naponEl: el,
                                  oznakaEl: polje.celija_oznaka,
                                  fazaEl: elpn.faza_opis,
                                  izolacija: history[elpn.moja_sifra],
                                });
                                view(elpn?.history);
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
          <div style={{ color: "blue", fontWeight: "bold" }}>
            Поље {currentEl?.oznakaEl}, {currentEl?.element} Фаза{" "}
            {currentEl?.fazaEl}
          </div>
          <ViewGraph chartData={chartData} />
        </div>
      ) : null}
    </div>
  );
};

export default NewReport;
