import React, { useContext, useMemo, useState, useRef } from "react";
import ReportContext from "../Context";
import TextareaAutosize from "react-textarea-autosize";
import Header from "./Header";
import Footer from "./Footer";
import napomenaText from "./Misljenje.json";

const Zakljucak = ({ napIzv, str, pageCount, setPageCount, ispPolja }) => {
  const [zuto, setZuto] = useState(null);
  const [crveno, setCrveno] = useState(null);
  const [dummy, setDummy] = useState(0);
  const bodyRef = useRef();

  const { history, elHist } = useContext(ReportContext);

  useMemo(() => {
    console.log(history);
    if (ispPolja) {
      let f = [],
        g = [];
      for (let i = 0; i < ispPolja.length; i++) {
        for (let j = 0; j < ispPolja[i].element.length; j++) {
          if (ispPolja[i].element[j].history[elHist]?.stanje_izolacije === 2) {
            f.push({
              napon: ispPolja[i].napon.trim(),
              ozn: ispPolja[i].celija_oznaka,
              naziv: ispPolja[i].celija_naziv,
              el: ispPolja[i].element[j].el_skraceno,
              faza: "фаза " + ispPolja[i].element[j].faza_opis,
            });
          } else if (
            ispPolja[i].element[j].history[elHist]?.stanje_izolacije === 3
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
      console.log(f, g);
      setZuto(f);
      setCrveno(g);
    }
  }, [history]);
  const expandPage = () => {
    console.log(bodyRef.current.offsetHeight);
    if (bodyRef.current.offsetHeight > 2050) {
      setPageCount((p) => p + 1);
      setDummy(1);
    }
  };

  return (
    <>
      <div
        className="report"
        style={{
          height:
            ((Object.keys(napIzv).length + dummy) * 29.7).toString() + "cm",
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
                }}
              >
                <Header />
                <Footer str={parseInt(str) + ih} pageCount={pageCount} z={1} />
              </div>
              <hr
                className="limiter"
                style={{
                  width: "18cm",
                  position: "absolute",
                  height: "1px",
                  top: ((ih + 1) * 28).toString() + "cm",
                }}
              ></hr>
            </>
          );
        })}
        {dummy > 0 ? (
          <div
            className="zakljucak"
            style={{
              height: "40px",
              width: "100%",
              position: "absolute",
              top: (Object.keys(napIzv).length * 29.7).toString() + "cm",
            }}
          >
            <Header />
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
            ref={bodyRef}
            style={{
              height:
                ((Object.keys(napIzv).length + dummy) * 26.7).toString() + "cm",
            }}
          >
            <tr style={{ border: "none" }}>
              <td style={{ border: "none", display: "block" }}>
                {napIzv
                  ? Object.keys(napIzv)
                      .sort()
                      .reverse()
                      .map((pn, iz) => {
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
                              defaultValue={`${napomenaText?.zadovoljavajuce[0]} мерних трансформатора кабловских завршница, потпорних изолатора ${napomenaText.zadovoljavajuce[1]}`}
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
                                  defaultValue={`Код испитане опреме са становишта ултразвучног испитивања, на  мерном трансформатору и кабловских завршница и потпорних изолатора уочена је делимична деградација изолационих система. То су следећи елементи, у табели Табела 2, означени жутом бојом:`}
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
                                  defaultValue={`Код испитане опреме са становишта ултразвучног испитивања, на мерном трансформатору и кабловских завршница и потпорних изолатора уочена је значајна деградација изолационих система. То су следећи елементи, у табели Табела 2, означени црвеном бојом:`}
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
                                    fontStyle: "italic",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Потребна замена елемента у оквиру редовног
                                  одржавања!
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
                                  minRows={7}
                                  defaultValue={`Напомена:
                                  Испитивања „UHF“ методом показала су да у ћелији К04, у приземљу где су смештени предметни елементима (КЗ и ПИ), постоје одређене сметње које се могу и чути, и које маскирају евентуално присуство парцијалних пражњења у испитиваним елементима. У овој ћелији је неопходно извршити проверу свих спојева у ћелији и/или снимање термовизијском камером. Након отклањања неисправности предлаже се да се изврши ново испитивање предметних елемената.`}
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
          onClick={() => expandPage()}
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
