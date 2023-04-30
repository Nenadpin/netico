import { useContext, useMemo } from "react";
import ReportContext from "../Context";
import Footer from "./Footer";
import logo from "../headerLogo.png";

const ReportTable = ({ izvBr, no, ispPolja, pageCount, napIzv }) => {
  const { history } = useContext(ReportContext);
  const colors = ["Без напона", "Зелено", "Жуто", "Црвено", "Љубичасто"];
  let r_br = 0;
  let str = [];
  useMemo(() => {
    if (no) {
      let total = Math.ceil(no / 43);
      for (let i = 0; i < total; i++) str.push(8 + i);
      // console.log(str);
    }
  }, [no]);

  return (
    <>
      {ispPolja ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            columnGap: "50px",
            height: (29.5 * str.length).toString() + "cm",
          }}
        >
          <table style={{ border: "none", width: "21cm" }}>
            <thead>
              <tr style={{ border: "none" }}>
                <td
                  style={{
                    height: "1.5cm",
                    border: "none",
                    paddingLeft: "1.5cm",
                    paddingBottom: "0.5cm",
                    fontSize: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      width: "18cm",
                      justifyContent: "space-between",
                    }}
                  >
                    <img src={logo} alt="logo" className="headerLogo"></img>
                    <span style={{ marginLeft: "-6.5cm" }}>
                      Netico solutions
                    </span>
                    <span
                      style={{
                        marginLeft: "2.5cm",
                        fontStyle: "italic",
                      }}
                    >
                      Извештај број: {izvBr?.broj_izvestaja}
                    </span>
                  </div>
                  <hr
                    style={{
                      width: "18cm",
                      height: "1px",
                    }}
                  ></hr>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr style={{ border: "none" }}>
                <td style={{ border: "none" }}>
                  <div>
                    {ispPolja ? (
                      <div
                        className="newContainer"
                        style={{ marginLeft: "1.5cm" }}
                      >
                        {Object.keys(napIzv).map((el, index) => {
                          return (
                            <table
                              className="tbl"
                              style={{ marginTop: "0", width: "18cm" }}
                            >
                              <caption
                                key={index}
                                style={{
                                  fontSize: "16px",
                                  fontStyle: "italic",
                                  padding: "10px",
                                  textAlign: "left",
                                }}
                              >
                                Табела 2 Резултати испитивања елемената {el} kV
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
                                {ispPolja
                                  .filter((x) => {
                                    r_br = 1;
                                    return (
                                      parseInt(x.napon) === parseInt(el) &&
                                      x.element
                                    );
                                  })
                                  .map((polje, idxP) => {
                                    return polje.element.map((elpn, idxE) => {
                                      if (history[elpn.moja_sifra])
                                        return (
                                          <tr
                                            style={{
                                              border: "1px solid black",
                                            }}
                                          >
                                            <td
                                              key={idxP}
                                              style={{
                                                border: "1px solid black",
                                              }}
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
                                            <td
                                              style={{
                                                border: "1px solid black",
                                              }}
                                            >
                                              {elpn.el_skraceno.trim()},{" "}
                                              {elpn.faza_opis}
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid black",
                                              }}
                                            >
                                              {elpn.tip}
                                            </td>
                                            <td
                                              style={{
                                                backgroundColor:
                                                  history[elpn.moja_sifra] === 1
                                                    ? "green"
                                                    : history[
                                                        elpn.moja_sifra
                                                      ] === 2
                                                    ? "yellow"
                                                    : history[
                                                        elpn.moja_sifra
                                                      ] === 3
                                                    ? "red"
                                                    : history[
                                                        elpn.moja_sifra
                                                      ] === 4
                                                    ? "purple"
                                                    : "white",
                                                cursor: "pointer",
                                                textAlign: "center",
                                              }}
                                            >
                                              {colors[history[elpn.moja_sifra]]}
                                            </td>
                                          </tr>
                                        );
                                      else return null;
                                    });
                                  })}
                              </tbody>
                            </table>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr style={{ border: "none" }}>
                <td style={{ height: "60px", border: "none" }}></td>
              </tr>
            </tfoot>
          </table>
          {str?.map((page, index) => {
            return (
              <>
                <Footer
                  pad={(28.5 + index * 29.5).toString() + "cm"}
                  str={page}
                  pageCount={pageCount}
                />
              </>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default ReportTable;
