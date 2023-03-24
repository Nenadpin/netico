import { useMemo, useRef } from "react";
import { useContext, useState } from "react";
import ReportContext from "../Context";
import PrintGraph from "./PrintGraph";

const Ispitivanje = () => {
  const {
    polja,
    trafoStanica,
    narudzbenica,
    examine,
    setExamine,
    sifraIspitivanja,
  } = useContext(ReportContext);
  const [currentEl, setCurrentEl] = useState(null);
  const [ispEls, setIspEls] = useState(null);
  const [chartData, setChartData] = useState(null);
  const selector = useRef();
  const selectorB = useRef();
  const colors = ["Без напона", "Зелено", "Жуто", "Црвено", "", "Slika"];
  let r_br = 0;

  const getElements = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/isp_elementi${narudzbenica.broj_narudzbenice}`
      );
      const jsonData = await response.json();
      console.log(jsonData);
      setIspEls(jsonData.elementi);
      if (localStorage.getItem("currExamine"))
        setExamine(JSON.parse(localStorage.getItem("currExamine")));
    } catch (error) {
      console.log(error.message);
    } finally {
      let labelS = [];
      for (let i = 0; i < 501; i++) {
        labelS.push(Math.floor(50 + i * 1.9));
      }
      let labelT = [];
      for (let i = 0; i < 601; i++) {
        labelT.push(Math.floor(-10 + i * 0.1));
      }
      setChartData({
        lub: "",
        luf: "",
        lt: "",
        us: {
          label: labelS,
          dataF: [],
          dataB: [],
        },
        ut: {
          label: labelT,
          data: [],
        },
      });
    }
  };

  const populateEls = () => {
    let newEl = [];
    for (let i = 0; i < examine?.length; i++) {
      newEl.push(examine[i].moja_sifra);
    }
    setIspEls(newEl);
  };

  useMemo(() => {
    if (narudzbenica) {
      getElements();
    }
  }, [narudzbenica]);

  const resetData = () => {
    let sd = chartData;
    sd.us.dataF = [];
    sd.ut.data = [];
    sd.luf = "";
    sd.lt = "";
    setChartData((ch) => ({
      ...sd,
    }));
    setCurrentEl(null);
  };
  const promeni = (ele, no) => {
    let tempel = examine.map((e) => {
      if (e.moja_sifra === ele) {
        return { ...e, isp: no };
      } else return e;
    });
    localStorage.setItem(ele, JSON.stringify(chartData));
    localStorage.setItem("currExamine", JSON.stringify(tempel));
    resetData();
    setExamine(tempel);
    setCurrentEl(null);
  };

  const submitIsp = async () => {
    if (
      window.confirm(
        "Sigurni ste da upisujemo ove rezultate? Elementi koji nisu oznaceni bojom ce biti bez napona?"
      )
    ) {
      let dataExam = examine.map((d) => {
        d = { ...d, chart: JSON.parse(localStorage.getItem(d.moja_sifra)) };
        return d;
      });
      const dataIsp = {
        sifra: sifraIspitivanja,
        nar: narudzbenica.broj_narudzbenice,
        isp: dataExam,
        nap: trafoStanica.naponski_nivo,
        naz: `ТС ${trafoStanica.naponski_nivo.trim()} kV ${trafoStanica.naziv}`,
      };
      console.log(dataIsp);
      try {
        const response2 = await fetch("http://localhost:5000/stanje", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataIsp),
        });
        if (response2.status === 210) {
          alert("primljeno");
          window.location.reload();
        } else {
          alert("neka greska...");
          return;
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  const reader = new FileReader();

  const inputRead = (e) => {
    e.preventDefault();
    let filename = e.target.files[0]?.name.slice(0, -4);
    reader.onload = (e) => {
      const text = e.target.result;
      let dF = [],
        dT = [];
      if (filename?.includes("FREQ") && !filename?.includes("Base")) {
        let a = text.split("</Header>");
        a = a[1]?.split("\r\n<d>");
        for (let i = 1; i < a.length; i++) {
          if (parseFloat(a[i])) {
            let temp = a[i].split(",");
            dF.push(parseFloat(temp[1]));
          }
        }
        let sd = { ...chartData };
        sd.us.dataF = dF;
        sd.luf = filename;
        setChartData(sd);
      } else if (filename?.includes("SCOPE")) {
        console.log(filename);
        let a = text.split('<units am="dBm" />');
        a = a[1].split("\r\n");
        for (let i = 1; i < a.length; i++) {
          if (parseFloat(a[i].substring(7))) {
            dT.push(parseFloat(a[i].substring(7)));
          }
        }
        let sd = { ...chartData };
        sd.ut.data = dT;
        sd.lt = filename;
        setChartData(sd);
      } else alert("Greska u citanju fajla...");
    };
    reader.readAsText(e.target.files[0]);
  };

  const inputBase = (e) => {
    e.preventDefault();
    let filename = e.target.files[0]?.name.slice(0, -4);
    reader.onload = (e) => {
      const text = e.target.result;
      let d = [];

      if (filename?.includes("Base")) {
        let a = text.split("</Header>");
        a = a[1].split("\r\n<d>");
        for (let i = 1; i < a.length; i++) {
          if (parseFloat(a[i])) {
            let temp = a[i].split(",");
            d.push(parseFloat(temp[1]));
          }
        }
        console.log(d);
        let sd = chartData;
        sd.us.dataB = d;
        sd.lub = filename;
        setChartData(sd);
      } else alert("Greska u citanju fajla ili nije Base fajl...");
    };
    reader.readAsText(e.target.files[0]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        columnGap: "50px",
      }}
    >
      <div className="newContainer">
        {!ispEls ? (
          <button onClick={() => populateEls()}>Сви елементи</button>
        ) : null}
        {trafoStanica.napon.map((el, index) => {
          return (
            <div key={index}>
              <h3>
                Polja sa naponom {el} kV{" "}
                <span
                  style={{
                    marginLeft: "1cm",
                    color: "blue",
                    cursor: "pointer",
                  }}
                  onClick={() => selectorB.current.click()}
                >
                  Учитај BASE
                </span>{" "}
              </h3>
              {polja
                .filter((x) => {
                  r_br = 1;
                  return parseInt(x.napon) === parseInt(el) && x.element;
                })
                .map((polje, idxP) => {
                  return (
                    <div className="newReportMain" key={idxP}>
                      <div
                        style={{ margin: "auto", width: "99%", height: "98%" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            backgroundColor: "white",
                            height: "100%",
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <span>
                            {polje.celija_oznaka}, {polje.celija_naziv}
                          </span>
                        </div>
                      </div>
                      <div>
                        {examine
                          .filter((e) => {
                            return e.broj_polja === polje.broj_polja;
                          })
                          .map((elpn, idxE) => {
                            return (
                              <div className="newReportSub" key={idxE}>
                                <span>
                                  {elpn.el_skraceno.trim()}, {elpn.faza_opis}
                                </span>
                                <span>{elpn.tip}</span>
                                <span
                                  style={{ position: "absolute", left: "15px" }}
                                >
                                  {r_br++}
                                </span>
                                <span
                                  onClick={() => {
                                    if (ispEls?.includes(elpn.moja_sifra)) {
                                      setCurrentEl({
                                        element: elpn.el_skraceno,
                                        naponEl: el,
                                        oznakaEl: polje.celija_oznaka,
                                        sifra: elpn.moja_sifra,
                                        fazaEl: elpn.faza_opis,
                                        izolacija: elpn.isp,
                                      });
                                      if (
                                        localStorage.getItem(elpn.moja_sifra)
                                      ) {
                                        console.log(elpn);
                                        setChartData((ch) => ({
                                          ...JSON.parse(
                                            localStorage.getItem(
                                              elpn.moja_sifra
                                            )
                                          ),
                                        }));
                                      } else {
                                        selector.current.click();
                                      }
                                    }
                                  }}
                                  style={{
                                    backgroundColor:
                                      elpn.isp === 1
                                        ? "green"
                                        : elpn.isp === 2
                                        ? "yellow"
                                        : elpn.isp === 3
                                        ? "red"
                                        : "white",
                                    cursor: "pointer",
                                  }}
                                >
                                  {colors[elpn.isp]}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
      <div className="diagram">
        <div style={{ color: "blue", fontWeight: "bold" }}>
          Поље {currentEl?.oznakaEl}, {currentEl?.element} Фаза{" "}
          {currentEl?.fazaEl}
        </div>
        <PrintGraph chartData={chartData} setChartData={setChartData} />
        <div style={{ display: "none" }}>
          <input type="file" onChange={inputBase} ref={selectorB} />
          <input type="file" onChange={inputRead} ref={selector} />
        </div>
        <div style={{ marginTop: "20px" }}>
          <button
            style={{ width: "110px", backgroundColor: "green" }}
            onClick={() => promeni(currentEl?.sifra, 1)}
          >
            Зелено
          </button>
          <button
            style={{ width: "110px", backgroundColor: "yellow" }}
            onClick={() => promeni(currentEl?.sifra, 2)}
          >
            Жуто
          </button>
          <button
            style={{ width: "110px", backgroundColor: "red" }}
            onClick={() => promeni(currentEl?.sifra, 3)}
          >
            Црвено
          </button>
          <button
            style={{ width: "110px", backgroundColor: "white" }}
            onClick={() => resetData()}
          >
            Ресетуј
          </button>
        </div>
        <button
          style={{ cursor: "pointer", width: "485px", alignSelf: "center" }}
          onClick={() => submitIsp()}
        >
          Упиши у базу
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default Ispitivanje;
