import React, { useContext, useState, useRef, useMemo } from "react";
import ReportContext from "../Context";
import { useReactToPrint } from "react-to-print";
import logo from "../logo.png";
import Footer from "./Footer";
import Header from "./Header";
import Sadrzaj from "./Sadrzaj";
import ReportTable from "./ReportTable";
import Zakljucak from "./Zakljucak";
const months = [
  "Јануар",
  "Фебруар",
  "Март",
  "Април",
  "Мај",
  "Јун",
  "Јул",
  "Август",
  "Септембар",
  "Октобар",
  "Новембар",
  "Децембар",
];

const Report = () => {
  const { polja, reports, elHist, ugovor, ispList, narudzbenica, history } =
    useContext(ReportContext);

  const [pageCount, setPageCount] = useState(0);
  const [no, setNo] = useState(0);
  const [ispCurr, setIspCurr] = useState([]);
  const [napIzv, setNapIzv] = useState(null);
  const [ispPolja, setIspPolja] = useState(null);
  const [izvBr, setIzvBr] = useState("");
  const printRef = useRef();
  const dateRef = useRef();
  const dateRef1 = useRef();
  const dateRef2 = useRef();

  useMemo(() => {
    if (narudzbenica && polja && history) {
      let no_el = Object.keys(history).length;
      console.log(no_el);
      setNo(no_el);
      let tIsp = ispList.filter((i) => {
        return i.narudzbenica === narudzbenica.broj_narudzbenice;
      });
      setIspCurr(tIsp);
      if (polja.length) {
        let f = polja.filter((p) => {
          return p.element;
        });
        f = f.filter((p) => {
          return (
            p.element.filter((e) => {
              return (
                e.history[elHist].stanje_izolacije !== 0 &&
                e.history[elHist].stanje_izolacije !== 5
              );
            }).length > 0
          );
        });
        for (let i = 0; i < f.length; i++) {
          f[i].element = f[i].element.filter((h) => {
            return h.history[elHist].stanje_izolacije !== 0;
          });
        }
        console.log(f);
        setIspPolja(f);
        setIzvBr(reports[elHist]?.broj_izvestaja);
      }
      let nap = {};
      for (let i = 0; i < narudzbenica.stavke.length; i++) {
        if ([1, 2, 6, 7, 10, 12].includes(narudzbenica.stavke[i].pos))
          nap["10"] = nap["10"]
            ? [...nap["10"], narudzbenica.stavke[i]]
            : [narudzbenica.stavke[i]];
        else if ([3, 4, 8, 9, 11, 13].includes(narudzbenica.stavke[i].pos))
          nap["35"] = nap["35"]
            ? [...nap["35"], narudzbenica.stavke[i]]
            : [narudzbenica.stavke[i]];
        else if ([5, 14].includes(narudzbenica.stavke[i].pos))
          nap["110"] = nap["110"]
            ? [...nap["110"], narudzbenica.stavke[i]]
            : [narudzbenica.stavke[i]];
      }
      no_el += 8 + Math.ceil(no_el / 43) + Object.keys(nap).length;
      console.log(nap);
      setPageCount(no_el);
      setNapIzv(nap);
    }
  }, [narudzbenica]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Izvestaj",
    onAfterPrint: () => alert("uspesno"),
  });

  const insertDate = (d) => {
    if (d.target.value.includes("/")) {
      dateRef.current.innerText =
        months[parseInt(d.target.value.split("/")[1]) - 1] +
        " " +
        d.target.value.split("/")[2];
      dateRef1.current.innerText =
        months[parseInt(d.target.value.split("/")[1]) - 1] +
        " " +
        d.target.value.split("/")[2];
      dateRef2.current.innerText =
        months[parseInt(d.target.value.split("/")[1]) - 1] +
        " " +
        d.target.value.split("/")[2];
    } else if (d.target.value.includes(".")) {
      dateRef.current.innerText =
        months[parseInt(d.target.value.split(".")[1]) - 1] +
        " " +
        d.target.value.split(".")[2];
      dateRef1.current.innerText =
        months[parseInt(d.target.value.split(".")[1]) - 1] +
        " " +
        d.target.value.split(".")[2];
      dateRef2.current.innerText =
        months[parseInt(d.target.value.split(".")[1]) - 1] +
        " " +
        d.target.value.split(".")[2];
    } else alert("Unesite ispravan datum izvestaja!");
  };

  return (
    <div id="test" ref={printRef} style={{ overflow: "scroll" }}>
      <div id="pg1" className="report">
        <img
          style={{ marginTop: "1.5cm", marginLeft: "0.5cm", display: "flex" }}
          src={logo}
          alt="logo"
          onClick={handlePrint}
        ></img>
        <p
          style={{
            display: "flex",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "16px",
            marginLeft: "1.2cm",
            fontWeight: "450",
            marginTop: "-10px",
          }}
        >
          Netico solutions
        </p>
        <p
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "30px",
            fontWeight: "600",
            display: "block",
            marginTop: "8cm",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#4f4d4d" }}>ИЗВЕШТАЈ БРОЈ: </span>
          <span style={{ color: "#74bc74" }}>
            {reports[elHist]?.broj_izvestaja}
          </span>
        </p>
        <p
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            display: "block",
            fontWeight: "normal",
            fontSize: "24px",
            textAlign: "center",
            marginTop: "15px",
            marginBottom: "0",
          }}
        >
          УЛТРАЗВУЧНО ИСПИТИВАЊЕ У
        </p>
        <p
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "24px",
            color: "#74bc74",
            display: "block",
            textAlign: "center",
          }}
        >
          {reports[elHist]?.naziv}
        </p>
        <br />
        <br />
        <p
          style={{
            fontSize: "16px",
            display: "block",
            textAlign: "center",
            marginTop: "10cm",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          <span ref={dateRef1}></span>
          год.
        </p>
      </div>
      <div id="pg2" className="report">
        <img
          style={{ marginTop: "1.5cm", marginLeft: "0.5cm", display: "flex" }}
          src={logo}
          alt="logo"
        ></img>
        <p
          style={{
            display: "flex",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "16px",
            marginLeft: "1.2cm",
            fontWeight: "450",
            marginTop: "-10px",
          }}
        >
          Netico solutions
        </p>
        <div>
          <p
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "20px",
              fontWeight: "600",
              display: "block",
              marginTop: "1cm",
              marginBottom: "0",
              textAlign: "center",
            }}
          >
            <span>ИЗВЕШТАЈ БРОЈ: </span>
            <span
              style={{
                color: "#74bc74",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {reports[elHist]?.broj_izvestaja}
            </span>
          </p>
          <p
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "20px",
              fontWeight: "normal",
              display: "block",
              marginTop: "1cm",
              marginBottom: "0",
              textAlign: "center",
            }}
          >
            УЛТРАЗВУЧНО ИСПИТИВАЊЕ У
          </p>
          <p
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "20px",
              display: "block",
              textAlign: "center",
              color: "#74bc74",
              fontWeight: "bold",
              marginTop: "0",
            }}
          >
            {reports[elHist]?.naziv}
          </p>
          <table
            className="tbl"
            style={{
              width: "16cm",
              textAlign: "left",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              border: "none",
            }}
          >
            <colgroup>
              <col span="1" style={{ width: "35%" }}></col>
              <col span="1" style={{ width: "65%" }}></col>
            </colgroup>
            <tbody>
              <tr>
                <td
                  style={{
                    lineHeight: "20px",
                    width: "6cm",
                    textAlign: "left",
                  }}
                >
                  Уговор
                </td>
                <td style={{ lineHeight: "20px", textAlign: "left" }}>
                  {ugovor?.opis_ugovora}
                </td>
              </tr>
              <tr>
                <td style={{ lineHeight: "30px", textAlign: "left" }}>
                  Број уговора
                </td>
                <td style={{ lineHeight: "20px", textAlign: "left" }}>
                  Овирни споразум бр. {ugovor.broj_ugovora_korisnik} од{" "}
                  {ugovor.datum_ugovora} године према ЈН 18-22
                </td>
              </tr>
              <tr>
                <td style={{ lineHeight: "40px", textAlign: "left" }}>
                  Наруџбеница број
                </td>
                <td style={{ lineHeight: "40px", textAlign: "left" }}>
                  нзн {narudzbenica.broj_narudzbenice}
                </td>
              </tr>
              <tr>
                <td style={{ lineHeight: "40px", textAlign: "left" }}>
                  Објекат
                </td>
                <td style={{ lineHeight: "40px", textAlign: "left" }}>
                  трансформаторска станица
                </td>
              </tr>
              <tr>
                <td style={{ lineHeight: "30px", textAlign: "left" }}>
                  Инсталисана снага
                </td>
                <td style={{ lineHeight: "30px", textAlign: "left" }}>
                  <input
                    type="text"
                    style={{
                      border: "none",
                      width: "0.7cm",
                      fontSize: "14px",
                      textAlign: "left",
                    }}
                  ></input>
                  -MVA
                </td>
              </tr>
              {reports[elHist]?.naponski_nivo.split("/").map((post, idp) => {
                return (
                  <tr key={idp}>
                    <td style={{ textAlign: "left" }}>
                      Постројење {post.trim()} kV
                    </td>
                    <td style={{ textAlign: "left" }}>
                      <input
                        type="text"
                        style={{
                          border: "none",
                          fontSize: "14px",
                          textAlign: "left",
                        }}
                        defaultValue="на отвореном"
                      ></input>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td style={{ lineHeight: "30px", textAlign: "left" }}>
                  Систем сабирница
                </td>
                <td style={{ lineHeight: "30px", textAlign: "left" }}>
                  <input
                    type="text"
                    style={{
                      border: "none",
                      fontSize: "14px",
                      width: "10cm",
                      textAlign: "left",
                    }}
                    defaultValue="помоћне сабирнице"
                  ></input>
                </td>
              </tr>
              <tr>
                <td style={{ lineHeight: "30px", textAlign: "left" }}>Место</td>
                <td style={{ lineHeight: "30px", textAlign: "left" }}>
                  {narudzbenica.mesto}
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: "left" }}>Датум/период испитивања</td>
                <td style={{ textAlign: "left" }}>
                  {ispCurr[0]?.datum} - {ispCurr[0]?.datum_do}
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: "left" }}>Температура</td>
                <td style={{ textAlign: "left" }}>
                  <input
                    type="text"
                    style={{
                      border: "none",
                      fontSize: "14px",
                      width: "0.5cm",
                      textAlign: "left",
                    }}
                  ></input>{" "}
                  °C
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <br></br>
                </td>
                <td></td>
              </tr>
              <tr>
                <td style={{ lineHeight: "20px", textAlign: "left" }}>
                  Број страна извештаја
                </td>
                <td style={{ lineHeight: "20px", textAlign: "left" }}>
                  <strong>{pageCount}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: "left" }}>Датум завршетка извештаја</td>
                <td style={{ textAlign: "left" }}>
                  <input
                    ref={dateRef}
                    onBlur={(e) => insertDate(e)}
                    type="text"
                    style={{
                      border: "none",
                      fontSize: "14px",
                      width: "2cm",
                      textAlign: "left",
                    }}
                  ></input>{" "}
                  г.
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: "left" }}>Датум доставе извештаја</td>
                <td style={{ textAlign: "left" }}>
                  <input
                    type="text"
                    style={{
                      border: "none",
                      fontSize: "14px",
                      width: "2cm",
                      textAlign: "left",
                    }}
                  ></input>
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: "left" }}>
                  Верзија темплејта извештаја
                </td>
                <td style={{ textAlign: "left" }}>
                  <strong>
                    ver{" "}
                    <input
                      type="text"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        width: "2cm",
                        fontWeight: "bold",
                        textAlign: "left",
                      }}
                    ></input>
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <table
            style={{
              width: "16cm",
              textAlign: "left",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              border: "1px solid black",
              borderCollapse: "collapse",
            }}
          >
            <colgroup>
              <col span="1" style={{ width: "35%" }}></col>
              <col span="1" style={{ width: "35%" }}></col>
              <col span="1" style={{ width: "30%" }}></col>
            </colgroup>
            <tbody>
              <tr>
                <td style={{ width: "6cm" }}></td>
                <td
                  style={{
                    border: "1px solid black",
                    width: "6cm",
                    textAlign: "left",
                  }}
                >
                  <span style={{ marginLeft: "5px" }}>
                    <strong>Име и Презиме</strong>
                  </span>
                </td>
                <td style={{ textAlign: "left" }}>
                  <span style={{ marginLeft: "5px" }}>
                    <strong>Потпис</strong>
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", textAlign: "left" }}>
                  <span style={{ marginLeft: "5px" }}>
                    <strong>Испитивања извршили</strong>
                  </span>
                </td>
                <td style={{ border: "1px solid black", textAlign: "left" }}>
                  <div style={{ marginLeft: "5px", textAlign: "left" }}>
                    {ispCurr[0]?.rukovodilac}
                    <br />
                    {ispCurr[0]?.izvrsilac1}
                  </div>
                </td>
                <td
                  style={{ border: "1px solid black", textAlign: "left" }}
                ></td>
              </tr>
              <tr>
                <td>
                  <div style={{ marginLeft: "5px", textAlign: "left" }}>
                    <strong>
                      Техничка обрада података <br /> и извештаја
                    </strong>
                  </div>
                </td>
                <td style={{ border: "1px solid black", textAlign: "left" }}>
                  <span style={{ marginLeft: "5px" }}>
                    {ispCurr[0]?.izvrsilac2}
                  </span>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <p
            style={{
              display: "block",
              textAlign: "center",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "16px",
              marginTop: "30px",
            }}
          >
            М.П.
          </p>
          <p
            style={{
              display: "block",
              textAlign: "right",
              marginRight: "2cm",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "16px",
            }}
          >
            Директор:
          </p>
          <br></br>
          <p
            style={{
              display: "block",
              textAlign: "center",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "16px",
              marginTop: "50px",
            }}
          >
            <span ref={dateRef2}></span> год.
          </p>
        </div>
        <Footer />
      </div>
      <Sadrzaj napIzv={napIzv} />
      <div id="pg4" className="report">
        <Header />
        <p
          style={{
            display: "block",
            marginTop: "1rem",
            marginRight: "1cm",
            fontFamily: "Arial",
            fontSize: "1.1rem",
            color: "#0073ce",
            textAlign: "center",
          }}
        >
          1 УВОД
        </p>
        <textarea
          rows={6}
          style={{
            border: "none",
            width: "18cm",
            textAlign: "left",
            marginTop: "1rem",
            marginRight: "1.5cm",
            fontFamily: "arial",
            fontSize: "1rem",
          }}
          defaultValue={`У извештају су приказани резултати ултразвучног испитивања струјних и напонских мерних трансформатора и кабловских завршница, у трансформаторској станици која је предмет овог извештаја, спроведених према Оквирном споразуму бр. ${ugovor.broj_ugovora_korisnik} od ${ugovor.datum_ugovora} године према ЈН 18-22. Испитивање је извршено према захтевима из наруџбенице:`}
        ></textarea>
        {reports[elHist]?.naponski_nivo.split("/").map((nap, idn) => {
          return (
            <div key={idn}>
              <p style={{ textAlign: "left" }}>{nap.trim()} kV</p>
              <table className="tbl1">
                <colgroup>
                  <col span="1" style={{ width: "10%" }}></col>
                  <col span="1"></col>
                  <col span="1" style={{ width: "15%" }}></col>
                </colgroup>
                <thead>
                  <tr>
                    <th>Ознака</th>
                    <th>Опис</th>
                    <th>Количина</th>
                  </tr>
                </thead>
                <tbody>
                  {napIzv
                    ? napIzv[nap.trim()].map((izv, idIzv) => {
                        return (
                          <tr key={idIzv}>
                            <td style={{ textAlign: "center" }}>{izv.pos}</td>
                            <td style={{ textAlign: "left", padding: "5px" }}>
                              {izv.opis}
                            </td>
                            <td style={{ textAlign: "center" }}>{izv.kol}</td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </div>
          );
        })}
        <textarea
          rows={4}
          style={{
            border: "none",
            width: "18cm",
            textAlign: "left",
            marginTop: "1rem",
            marginRight: "1.5cm",
            fontFamily: "arial",
            fontSize: "1rem",
          }}
          defaultValue={`Испитивања су спроведена "On Line", односно у погону. На основу резултата испитивања дате су препоруке за даље коришћење и контроле испитиваних елемената.`}
        ></textarea>
        <Footer str="4" pageCount={pageCount} />
      </div>
      <div id="pg6" className="report">
        <Header />
        <p
          style={{
            display: "block",
            marginTop: "2rem",
            marginRight: "1cm",
            fontFamily: "Arial",
            fontSize: "1.1rem",
            color: "#0073ce",
            textAlign: "center",
          }}
        >
          3 ПОДАЦИ О МЕРНИМ ИНСТРУМЕНТИМА И ОПРЕМИ
        </p>
        <p
          style={{ textAlign: "left", marginTop: "2rem", marginBottom: "1rem" }}
        >
          Уређај за испитивање парцијалних пражњења
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "4cm 4cm",
            textAlign: "left",
          }}
        >
          <span>Произвођач</span>
          <span>
            <input
              defaultValue="DOBLE"
              style={{ border: "none", width: "100%" }}
            ></input>
          </span>
          <span>Тип</span>
          <span>
            <input
              defaultValue="DFA300"
              style={{ border: "none", width: "100%" }}
            ></input>
          </span>
          <span>Серијски број</span>
          <span>
            <input
              defaultValue="207000109"
              style={{ border: "none", width: "100%" }}
            ></input>
          </span>
          <span>Калибрисан до</span>
          <span>
            <input
              defaultValue="07-2020"
              style={{ border: "none", width: "100%" }}
            ></input>
          </span>
          <span>Антена</span>
          <span>
            <input
              defaultValue="Whip antena"
              style={{ border: "none", width: "100%" }}
            ></input>
          </span>
        </div>
        <p
          style={{
            display: "block",
            marginTop: "2rem",
            marginRight: "1cm",
            fontFamily: "Arial",
            fontSize: "1.1rem",
            color: "#0073ce",
            textAlign: "center",
          }}
        >
          4 ОПИС ИСПИТИВАЊА
        </p>
        <textarea
          rows={36}
          style={{
            border: "none",
            width: "18cm",
            textAlign: "justify",
            marginTop: "1rem",
            marginRight: "1.5cm",
            fontFamily: "arial",
            fontSize: "0.9rem",
          }}
          defaultValue={`Испитивања присуства парцијалних пражњења у изолационим системима кабловских завршница и мерних трансформатора врше се у складу са техничком препоруком IEC TS 62-478:2016 "High voltage test techniques - Measurement of partial discharges by electromagnetic and acoustic methods", и техничким брошурама CIGRE TB 502 и CIGRE TB 444.
          Испитивања стања изолационих система мерних трансформатора и кабловских завршница вршени су у погону под напоном ултразвучном "UHF" методом. Предност ових испитивања у односу на конвенционална испитивања стања изолационих система је што се спроводе под напоном односно без прекида испоруке електричне енергије, као и веома велики ниво отпорности ове методе на сметње при раду.
          UHF метода је бесконтактна и заснива се на поређењу сигнала референтног мерења снимљеног у близини ТС (сигнал позадинских сметњи - Baseline) и сигнала снимљеног у близини испитиваног елемента. У случају постојања парцијалних пражњења уочава се значајније одступање поређених сигнала. Постоје два мода за анализу UHF мерења, спектрални и временски, на основу којих се са сигурношћу може утврдити да ли је парцијално пражњење присутно унутар изолационог система испитиваног елемента.
          Акустична метода се примењује на елементе код којих је UHF испитивањем дијагностификована појава парцијалних пражњења. Акустично испитивање врши се тако што се пиезоелектрични сензори помоћу изолационог штапа под напоном прислањају на испитивани елеменат. Елементи се испитују у неколико карактеристичних тачака. Постоје два мода за анализу акустичних мерења на основу којих се може проценити амплитуда напона парцијалног пражњења као и изглед “patern”-а парцијалних пражњења. Акустичним испитивањем може се потврдити појава парцијалног пражњења. Такође је могуће испитати елементе у свакој од фаза и на тај начин утврдити тачно на ком елементу и на којој фази постоји парцијално пражњење. Мерна метода је неинвезивна и омогућава лоцирање парцијалних пражњења унутар изолационог система испитиваних елемената као и процену нивоа парцијалних пражњења или нивоа деградираности изолационог система у погонским условима.`}
        ></textarea>
        <Footer str="6" pageCount={pageCount} />
      </div>
      <div id="pg7" className="report">
        <Header />
        <p
          style={{
            display: "block",
            marginTop: "2rem",
            marginRight: "1cm",
            fontFamily: "Arial",
            fontSize: "1.1rem",
            color: "#0073ce",
            textAlign: "center",
          }}
        >
          5 РЕЗУЛТАТИ ИСПИТИВАЊА
        </p>
        <textarea
          rows={4}
          style={{
            border: "none",
            width: "18.5cm",
            textAlign: "justify",
            marginTop: "1rem",
            marginRight: "1cm",
            fontFamily: "arial",
            fontSize: "1rem",
          }}
          defaultValue={`Резултати испитивања су класификовани према стању изолационог система испитиваних елемената на основу присутности парцијалних пражњења и разврстани у три групе означене бојама као у табели 1: зелено, жуто или црвено. Резултати су приказани на испитним листама, заједно са UHF снимцима и у табелама 2 и 3.`}
        ></textarea>
        <p
          style={{ marginTop: "1rem", marginBottom: "1rem", textAlign: "left" }}
        >
          Табела 1. Објашњења класификације испитиване опреме према стању
          изолационог система
        </p>
        <table className="tbl1" style={{ marginLeft: "1cm" }}>
          <colgroup>
            <col span="1" style={{ width: "10%" }}></col>
            <col span="1"></col>
          </colgroup>
          <tbody>
            <tr>
              <td>
                <div
                  style={{
                    width: "1cm",
                    height: "0.5cm",
                    backgroundColor: "green",
                    margin: "auto",
                  }}
                ></div>
              </td>
              <td style={{ textAlign: "left", padding: "0 5px" }}>
                Није уочена значајнија деградација изолационих система, па се
                може проценити да су испитивани елементи спремни за нормалну
                употребу у погону. Препорука: редовна контрола.
              </td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                    width: "1cm",
                    height: "0.5cm",
                    backgroundColor: "yellow",
                    margin: "auto",
                  }}
                ></div>
              </td>
              <td style={{ textAlign: "left", padding: "0 5px" }}>
                Уочена делимична деградација изолационих система, али се не може
                са сигурношћу проценити када ће наступити значајнија деградација
                изолације. Препорука: пооштрена контрола или замена у оквиру
                редовног одржавања
              </td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                    width: "1cm",
                    height: "0.5cm",
                    backgroundColor: "red",
                    margin: "auto",
                  }}
                ></div>
              </td>
              <td style={{ textAlign: "left", padding: "0 5px" }}>
                Уочена значајна деградација изолационог система – Елементи нису
                од изузетног значаја, потребна замена елемента у оквиру редовног
                одржавања
              </td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                    width: "1cm",
                    height: "0.5cm",
                    backgroundColor: "purple",
                    margin: "auto",
                  }}
                ></div>
              </td>
              <td style={{ textAlign: "left", padding: "0 5px" }}>
                Уочена значајна деградација – Елементи од изузетног значаја,
                потребна хитна замена елемента (интервентно одржавање)
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ textAlign: "left", margin: "1rem 0" }}>
          Значење скраћеница:
        </p>
        <p style={{ textAlign: "left" }}>ПИ – потпорни изолатор</p>
        <p style={{ textAlign: "left" }}>КЗ – кабловкса завршница</p>
        <p style={{ textAlign: "left" }}>НМТ – напонски мерни трансофматор</p>
        <p style={{ textAlign: "left" }}>СМТ – струјни мерни трансформатор</p>
        <Footer str="7" pageCount={pageCount} />
      </div>
      <div id="pg6" className="reportTable">
        <ReportTable
          izvBr={izvBr}
          no={no}
          ispPolja={ispPolja}
          pageCount={[pageCount]}
        />
        <Zakljucak
          napIzv={napIzv}
          str={(8 + Math.ceil(no / 43)).toString()}
          pageCount={pageCount}
          ispPolja={ispPolja}
        />
      </div>
    </div>
  );
};

export default Report;
