import React, { useContext, useMemo, useState } from "react";
import ReportContext from "../Context";
import TextareaAutosize from "react-textarea-autosize";
import Header from "./Header";
import Footer from "./Footer";
import napomenaText from "./Misljenje.json";

const Zakljucak = ({ napIzv, str, pageCount, ispPolja }) => {
  const [elements, setElements] = useState(null);
  const [zuto, setZuto] = useState(null);
  const [crveno, setCrveno] = useState(null);

  const { history, elHist } = useContext(ReportContext);

  useMemo(() => {
    let listItems = Object.keys(history);
    let elObj = {
      st: {},
      nt: {},
      kz: {},
      pi: {},
    };
    for (let i = 0; i < listItems.length; i++) {
      let item = listItems[i].slice(-4, -2);
      if (item === "ST")
        elObj.st[parseInt(listItems[i].substring(5, 8))]
          ? (elObj.st[parseInt(listItems[i].substring(5, 8))] += 1)
          : (elObj.st[parseInt(listItems[i].substring(5, 8))] = 1);
      else if (item === "NT")
        elObj.nt[parseInt(listItems[i].substring(5, 8))]
          ? (elObj.nt[parseInt(listItems[i].substring(5, 8))] += 1)
          : (elObj.nt[parseInt(listItems[i].substring(5, 8))] = 1);
      else if (item === "KZ")
        elObj.st[parseInt(listItems[i].substring(5, 8))]
          ? (elObj.kz[parseInt(listItems[i].substring(5, 8))] += 1)
          : (elObj.kz[parseInt(listItems[i].substring(5, 8))] = 1);
      else
        elObj.pi[parseInt(listItems[i].substring(5, 8))]
          ? (elObj.pi[parseInt(listItems[i].substring(5, 8))] += 1)
          : (elObj.pi[parseInt(listItems[i].substring(5, 8))] = 1);
    }
    setElements(elObj);
    if (ispPolja) {
      let f = [],
        g = [];
      for (let i = 0; i < ispPolja.length; i++) {
        for (let j = 0; j < ispPolja[i].element.length; j++) {
          if (ispPolja[i].element[j].history[elHist].stanje_izolacije === 2) {
            f.push({
              napon: ispPolja[i].napon.trim(),
              ozn: ispPolja[i].celija_oznaka,
              naziv: ispPolja[i].celija_naziv,
              el: ispPolja[i].element[j].el_skraceno,
              faza: "фаза " + ispPolja[i].element[j].faza_opis,
            });
          } else if (
            ispPolja[i].element[j].history[elHist].stanje_izolacije === 3
          ) {
            g.push({
              napon: ispPolja[i].napon.trim(),
              ozn: ispPolja[i].celija_oznaka,
              naziv: ispPolja[i].celija_naziv,
              el: ispPolja[i].element[j].el_skraceno,
              faza: "фаза " + ispPolja[i].element[j].faza_opis,
            });
          }
        }
      }
      setZuto(f);
      setCrveno(g);
    }
  }, [history]);

  return (
    <>
      <div
        className="report"
        style={{
          height: (Object.keys(napIzv).length * 29.7).toString() + "cm",
        }}
      >
        {Object.keys(napIzv).map((h, ih) => {
          return (
            <div
              key={ih}
              style={{
                height: "40px",
                width: "100%",
                position: "absolute",
                top: (ih * 29.7).toString() + "cm",
              }}
            >
              <Header />
              <Footer str={parseInt(str) + ih} pageCount={pageCount} z={1} />
              <hr
                style={{
                  position: "absolute",
                  left: "-1.5cm",
                  width: "21cm",
                  height: "1px",
                  top: ((ih + 1) * 29.7).toString() + "cm",
                }}
              ></hr>
            </div>
          );
        })}
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
              ></td>
            </tr>
          </thead>
          {napIzv && elements
            ? Object.keys(napIzv)
                .sort()
                .reverse()
                .map((pn, iz) => {
                  return (
                    <tbody>
                      <tr style={{ border: "none" }}>
                        <td style={{ border: "none" }}>
                          <div
                            key={iz}
                            style={{
                              display: "block",
                              textAlign: "left",
                            }}
                          >
                            {iz === 0 ? (
                              <>
                                <textarea
                                  rows={3}
                                  style={{
                                    border: "none",
                                    width: "18cm",
                                    textAlign: "justify",
                                    fontFamily: "arial",
                                    fontSize: "0.9rem",
                                    marginTop: "0.5cm",
                                  }}
                                  defaultValue={`У прилогу извештаја налазе се засебни испитни листови за сваки од елемената. У испитним листовима дати су подаци о елементима који су испитани и UHF снимци у спектралном и временском моду.`}
                                ></textarea>
                                <p
                                  style={{
                                    display: "block",
                                    textAlign: "center",
                                    fontFamily: "Arial",
                                    fontSize: "1rem",
                                    color: "#0073ce",
                                    marginTop: "1cm",
                                  }}
                                >
                                  6 ЗАКЉУЧАК - МИШЉЕЊЕ И ТУМАЧЕЊЕ
                                </p>
                              </>
                            ) : null}
                            <p
                              style={{
                                display: "block",
                                textAlign: "left",
                                marginTop: "1rem",
                                fontFamily: "Arial",
                                fontSize: "1rem",
                                color: "#0073ce",
                              }}
                            >
                              6.1 Напонски ниво {pn}kV
                            </p>
                            <TextareaAutosize
                              style={{
                                border: "none",
                                width: "18cm",
                                textAlign: "justify",
                                marginTop: "1rem",
                                marginRight: "1.5cm",
                                fontFamily: "arial",
                                fontSize: "0.9rem",
                              }}
                              defaultValue={`У ${pn}kV делу ТС, ултразвучном методом испитано је ${
                                elements.st[pn] + elements.nt[pn]
                              },  мерних трансформатора, ${
                                elements.st[pn]
                                  ? `${elements.st[pn]} струјних, `
                                  : ""
                              }${
                                elements.nt[pn]
                                  ? `${elements.nt[pn]} напонских`
                                  : ""
                              } мерних трансформатора, ${
                                elements.kz[pn]
                                  ? `${elements.kz[pn]} кабловских завршница, `
                                  : ""
                              }${
                                elements.pi[pn]
                                  ? `${elements.pi[pn]} потпорних изолатора`
                                  : ""
                              }. Резултати испитивања приказани су у Табели 2, испитни листови испитане опреме налазе се у делу 7 ПРИЛОЗИ.`}
                            />
                            <p
                              style={{
                                width: "18cm",
                                margin: "1rem 2cm 1rem 0",
                                textAlign: "justify",
                                fontSize: "0.9rem",
                              }}
                            >
                              {napomenaText.baza}
                            </p>
                            <TextareaAutosize
                              style={{
                                textDecoration: "underline",
                                margin: "1rem 0",
                                border: "none",
                                width: "18cm",
                                textAlign: "left",
                                marginRight: "1.5cm",
                                fontFamily: "arial",
                                fontSize: "1rem",
                              }}
                              defaultValue="ЗАДОВОЉАВАЈУЋЕ СТАЊЕ СА СТАНОВИШТА ИСПИТИВАЊА ИЗОЛАЦИЈЕ"
                            />
                            <TextareaAutosize
                              style={{
                                border: "none",
                                width: "18cm",
                                textAlign: "justify",
                                marginRight: "1.5cm",
                                fontFamily: "arial",
                                fontSize: "0.9rem",
                              }}
                              minRows={6}
                              defaultValue={`${
                                napomenaText?.zadovoljavajuce[0]
                              } ${
                                elements.st[pn] +
                                elements.nt[pn] -
                                zuto?.filter((z) => {
                                  return (
                                    z.napon === pn &&
                                    z.el.substring(1, 3) === "МТ"
                                  );
                                }).length
                              } мерних трансформатора ${
                                elements.kz[pn]
                                  ? `${
                                      elements.kz[pn] -
                                      zuto?.filter((z) => {
                                        return z.napon === pn && z.el === "КЗ";
                                      }).length
                                    } кабловских завршница, `
                                  : ""
                              } и ${
                                elements.pi[pn]
                                  ? `${
                                      elements.pi[pn] -
                                      zuto?.filter((z) => {
                                        return z.napon === pn && z.el === "ПИ";
                                      }).length
                                    } потпорних изолатора `
                                  : ""
                              } ${napomenaText.zadovoljavajuce[1]}`}
                            />
                            <p
                              style={{
                                margin: "1rem 0",
                                fontWeight: "bold",
                                fontStyle: "italic",
                                fontSize: "0.9rem",
                              }}
                            >
                              {napomenaText.zadovoljavajuce[2]}
                            </p>
                            {(zuto?.filter((z) => {
                              return z.napon === pn;
                            })).length > 0 ? (
                              <div>
                                <p
                                  style={{
                                    textDecoration: "underline",
                                    margin: "1rem 0",
                                    fontSize: "1rem",
                                  }}
                                >
                                  ДЕЛИМИЧНА ДЕГРАДАЦИЈА ИЗОЛАЦИОНОГ СИСТЕМА
                                </p>
                                <TextareaAutosize
                                  style={{
                                    border: "none",
                                    width: "18cm",
                                    textAlign: "justify",
                                    marginRight: "1.5cm",
                                    fontFamily: "arial",
                                    fontSize: "0.9rem",
                                  }}
                                  minRows={3}
                                  defaultValue={`Код испитане опреме са становишта ултразвучног испитивања, на ${
                                    zuto?.filter((z) => {
                                      return (
                                        z.napon === pn &&
                                        z.el.substring(1, 3) === "МТ"
                                      );
                                    }).length
                                      ? `${
                                          zuto?.filter((z) => {
                                            return (
                                              z.napon === pn &&
                                              z.el.substring(1, 3) === "МТ"
                                            );
                                          }).length
                                        } мерном трансформатору и`
                                      : ""
                                  } ${
                                    zuto?.filter((z) => {
                                      return z.napon === pn && z.el === "КЗ";
                                    }).length
                                      ? `${
                                          zuto?.filter((z) => {
                                            return (
                                              z.napon === pn && z.el === "КЗ"
                                            );
                                          }).length
                                        } кабловских завршница и`
                                      : ""
                                  } ${
                                    zuto?.filter((z) => {
                                      return z.napon === pn && z.el === "ПИ";
                                    }).length
                                      ? `${
                                          zuto?.filter((z) => {
                                            return (
                                              z.napon === pn && z.el === "ПИ"
                                            );
                                          }).length
                                        } потпорних изолатора`
                                      : ""
                                  } уочена је делимична деградација изолационих система. То су следећи елементи, у табели Табела 2, означени жутом бојом:`}
                                />
                                {zuto.map((e, id) => {
                                  return (
                                    <p
                                      key={id}
                                      style={{
                                        marginLeft: "2cm",
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      {e.ozn} {e.naziv} {e.el} {e.faza}
                                    </p>
                                  );
                                })}
                                <p
                                  style={{
                                    marginTop: "1rem",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  али не може се са сигурношћу проценити када ће
                                  наступити значајнија деградација изолације.
                                </p>
                                <p
                                  style={{
                                    marginTop: "1rem",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Препоручује се пооштрена контрола стања
                                  изолационих система испитиване опреме.
                                </p>
                                <p
                                  style={{
                                    margin: "1rem 0",
                                    fontWeight: "bold",
                                    fontStyle: "italic",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {napomenaText.delimicna[2]}
                                </p>
                              </div>
                            ) : null}
                            {(crveno?.filter((z) => {
                              return z.napon === pn;
                            })).length > 0 ? (
                              <div>
                                <p
                                  style={{
                                    textDecoration: "underline",
                                    margin: "1rem 0",
                                    fontSize: "1rem",
                                  }}
                                >
                                  ЗНАЧАЈНА ДЕГРАДАЦИЈА ИЗОЛАЦИОНОГ СИСТЕМА
                                </p>
                                <TextareaAutosize
                                  style={{
                                    border: "none",
                                    width: "18cm",
                                    textAlign: "justify",
                                    marginRight: "1.5cm",
                                    fontFamily: "arial",
                                    fontSize: "0.9rem",
                                  }}
                                  minRows={3}
                                  defaultValue={`Код испитане опреме са становишта ултразвучног испитивања, на ${
                                    crveno?.filter((z) => {
                                      return (
                                        z.napon === pn &&
                                        z.el.substring(1, 3) === "МТ"
                                      );
                                    }).length
                                      ? `${
                                          crveno?.filter((z) => {
                                            return (
                                              z.napon === pn &&
                                              z.el.substring(1, 3) === "МТ"
                                            );
                                          }).length
                                        } мерном трансформатору и`
                                      : ""
                                  } ${
                                    crveno?.filter((z) => {
                                      return z.napon === pn && z.el === "КЗ";
                                    }).length
                                      ? `${
                                          crveno?.filter((z) => {
                                            return (
                                              z.napon === pn && z.el === "КЗ"
                                            );
                                          }).length
                                        } кабловских завршница и`
                                      : ""
                                  } ${
                                    crveno?.filter((z) => {
                                      return z.napon === pn && z.el === "ПИ";
                                    }).length
                                      ? `${
                                          crveno?.filter((z) => {
                                            return (
                                              z.napon === pn && z.el === "ПИ"
                                            );
                                          }).length
                                        } потпорних изолатора`
                                      : ""
                                  } уочена је значајна деградација изолационих система. То су следећи елементи, у табели Табела 2, означени црвеном бојом:`}
                                />
                                {crveno.map((e, id) => {
                                  return (
                                    <p
                                      key={id}
                                      style={{
                                        marginLeft: "2cm",
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      {e.ozn} {e.naziv} {e.el} {e.faza}
                                    </p>
                                  );
                                })}
                                <p
                                  style={{
                                    marginTop: "1rem",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Препоручује се замена елемената изолационих
                                  система испитиване опреме.
                                </p>
                                <p
                                  style={{
                                    margin: "1rem 0",
                                    fontWeight: "bold",
                                    fontStyle: "italic",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {napomenaText.znacajna[2]}
                                </p>
                              </div>
                            ) : null}
                            <p
                              style={{
                                margin: "1rem 1cm 1rem 0",
                                fontWeight: "bold",
                                fontStyle: "italic",
                                fontSize: "0.9rem",
                              }}
                            >
                              Напомена
                            </p>
                            <p
                              style={{
                                width: "18cm",
                                margin: "1rem 1.5cm 1rem 0",
                                textAlign: "justify",
                                fontWeight: "bold",
                                fontStyle: "italic",
                                fontSize: "0.9rem",
                              }}
                            >
                              {napomenaText.napomena[0]}
                            </p>
                            <p
                              style={{
                                width: "18cm",
                                margin: "1rem 1.5cm 1rem 0",
                                textAlign: "justify",
                                fontWeight: "bold",
                                fontStyle: "italic",
                                fontSize: "0.9rem",
                              }}
                            >
                              {napomenaText.napomena[1]}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  );
                })
            : null}
          <tfoot>
            <tr style={{ border: "none" }}>
              <td style={{ height: "1.5cm", border: "none" }}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="report">
        <Header />
        <p
          style={{
            display: "block",
            textAlign: "center",
            fontFamily: "Arial",
            fontSize: "1.2rem",
            color: "#0073ce",
            marginTop: "13.5cm",
          }}
        >
          7 ПРИЛОЗИ
        </p>
        <Footer
          str={parseInt(str) + Object.keys(napIzv).length}
          pageCount={pageCount}
        />
      </div>
    </>
  );
};
export default Zakljucak;
