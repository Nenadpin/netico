import React, { useContext, useMemo, useState, useRef } from "react";
import ReportContext from "../Context";
import TextareaAutosize from "react-textarea-autosize";
import Header from "./Header";
import Footer from "./Footer";
import zakljucakText from "./Misljenje.json";

const Zakljucak = ({
  napIzv,
  str,
  pageCount,
  setPageCount,
  ispPolja,
  izvBr,
}) => {
  const [zuto, setZuto] = useState(null);
  const [crveno, setCrveno] = useState(null);
  const [dummy, setDummy] = useState(0);
  const bodyRef = useRef();

  const { history } = useContext(ReportContext);

  useMemo(() => {
    console.log(history);
    if (ispPolja) {
      let f = [],
        g = [];
      for (let i = 0; i < ispPolja.length; i++) {
        for (let j = 0; j < ispPolja[i].element?.length; j++) {
          if (history[ispPolja[i].element[j].moja_sifra] === 2) {
            f.push({
              napon: ispPolja[i].napon.trim(),
              ozn: ispPolja[i].celija_oznaka,
              naziv: ispPolja[i].celija_naziv,
              el: ispPolja[i].element[j].el_skraceno,
              faza: "фаза " + ispPolja[i].element[j].faza_opis,
            });
          } else if (history[ispPolja[i].element[j].moja_sifra] === 3) {
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
      console.log(f, g);
      setZuto(f);
      setCrveno(g);
    }
  }, [history]);
  const expandPage = () => {
    if (dummy === 0) {
      setPageCount((p) => p + 1);
      setDummy(1);
    } else {
      setPageCount((p) => p - 1);
      setDummy(0);
    }
  };

  return (
    <>
      <div
        className="report"
        style={{
          height:
            ((Object.keys(napIzv).length + dummy) * 29.5).toString() + "cm",
        }}
      >
        {Object.keys(napIzv).map((h, ih) => {
          return (
            <>
              <div
                className="zakljucak"
                key={ih}
                style={{
                  height: "40px",
                  width: "100%",
                  position: "absolute",
                  top: (ih * 29.7).toString() + "cm",
                  zIndex: 1,
                }}
              >
                <Header izvBr={izvBr} />
                <Footer str={parseInt(str) + ih} pageCount={pageCount} z={1} />
              </div>
              <hr
                className="limiter"
                style={{
                  width: "21cm",
                  position: "absolute",
                  height: "1px",
                  color: "black",
                  marginLeft: "-1.5cm",
                  top: ((1 + ih) * 26.2).toString() + "cm",
                  zIndex: 1,
                }}
              ></hr>
            </>
          );
        })}
        {dummy > 0 ? (
          <div
            className="zakljucak"
            style={{
              height: "50px",
              width: "100%",
              position: "absolute",
              top: (Object.keys(napIzv).length * 29.7).toString() + "cm",
              zIndex: 1,
            }}
          >
            <Header izvBr={izvBr} />
            <Footer
              str={parseInt(str) + Object.keys(napIzv).length}
              pageCount={pageCount}
              z={1}
            />
          </div>
        ) : null}
        <table
          style={{
            border: "none",
            width: "21cm",
            position: "absolute",
          }}
        >
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
          <tbody
            style={{
              height:
                ((Object.keys(napIzv).length + dummy) * 26.7).toString() + "cm",
            }}
          >
            <tr style={{ border: "none" }}>
              <td style={{ border: "none", display: "block" }}>
                {napIzv
                  ? Object.keys(napIzv).map((pn, iz) => {
                      return (
                        <div
                          key={iz}
                          style={{
                            display: "block",
                            textAlign: "left",
                            width: "18cm",
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
                                defaultValue={zakljucakText.start}
                              ></textarea>
                              <p
                                style={{
                                  display: "block",
                                  textAlign: "center",
                                  fontFamily: "Arial",
                                  fontSize: "1rem",
                                  color: "#0073ce",
                                  marginTop: "1cm",
                                  marginLeft: "-1.5cm",
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
                            maxRows={7}
                            defaultValue={`У ${pn}kV делу ТС, ултразвучном методом испитано је ${
                              Object.keys(history)?.length
                            },  мерних трансформатора,  струјних,  напонских мерних трансформатора, кабловских завршница, потпорних изолатора. Резултати испитивања приказани су у Табели 2, испитни листови испитане опреме налазе се у делу 7 ПРИЛОЗИ.`}
                          />
                          <p
                            style={{
                              width: "18cm",
                              margin: "1rem 2cm 1rem 0",
                              textAlign: "justify",
                              fontSize: "0.9rem",
                            }}
                          >
                            {zakljucakText.baza}
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
                            defaultValue={`${zakljucakText?.zadovoljavajuce[0]} мерних трансформатора кабловских завршница, потпорних изолатора ${zakljucakText.zadovoljavajuce[1]}`}
                          />
                          <p
                            style={{
                              margin: "1rem 0",
                              fontWeight: "bold",
                              fontStyle: "italic",
                              fontSize: "0.9rem",
                            }}
                          >
                            {zakljucakText.zadovoljavajuce[2]}
                          </p>
                          {zuto?.filter((z) => {
                            return z.napon === pn;
                          })?.length > 0 ? (
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
                                defaultValue={
                                  zakljucakText.delimicna[0] +
                                  zakljucakText.delimicna[1]
                                }
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
                                    {e.napon === pn ? (
                                      <span>
                                        {e.ozn} {e.naziv} {e.el} {e.faza}
                                      </span>
                                    ) : null}
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
                                {zakljucakText.delimicna[2]}
                              </p>
                            </div>
                          ) : null}
                          {crveno?.filter((z) => {
                            return z.napon === pn;
                          })?.length > 0 ? (
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
                                defaultValue={
                                  zakljucakText.znacajna[0] +
                                  zakljucakText.znacajna[1]
                                }
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
                                    {e.napon === pn ? (
                                      <span>
                                        {e.ozn} {e.naziv} {e.el} {e.faza}
                                      </span>
                                    ) : null}
                                  </p>
                                );
                              })}
                              <p
                                style={{
                                  marginTop: "1rem",
                                  fontSize: "0.9rem",
                                  fontStyle: "italic",
                                  fontWeight: "bold",
                                }}
                              >
                                {zakljucakText.znacajna[2]}
                              </p>
                              <TextareaAutosize
                                style={{
                                  border: "none",
                                  width: "18cm",
                                  textAlign: "justify",
                                  marginRight: "1.5cm",
                                  fontFamily: "arial",
                                  fontWeight: "bold",
                                  fontStyle: "italic",
                                  fontSize: "0.9rem",
                                }}
                                minRows={3}
                                defaultValue={zakljucakText.dodatno}
                              />
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
                            {zakljucakText.napomena[0]}
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
                            {zakljucakText.napomena[1]}
                          </p>
                        </div>
                      );
                    })
                  : null}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{ border: "none" }}>
              <td style={{ height: "1.5cm", border: "none" }}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="report">
        <Header izvBr={izvBr} />
        <p
          style={{
            display: "block",
            textAlign: "center",
            fontFamily: "Arial",
            fontSize: "1.2rem",
            color: "#0073ce",
            marginTop: "13.5cm",
          }}
          onClick={() => expandPage()}
        >
          7 ПРИЛОЗИ
        </p>
        <Footer
          str={parseInt(str) + Object.keys(napIzv).length + dummy}
          pageCount={pageCount}
        />
      </div>
    </>
  );
};
export default Zakljucak;
