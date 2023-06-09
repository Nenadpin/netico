import { useMemo, useRef } from "react";
import { useContext, useState } from "react";
import ReportContext from "../Context";
import PrintGraph from "./PrintGraph";
import Spinner from "./Spinner";
import { useEffect } from "react";

const Ispitivanje = () => {
  const {
    polja,
    trafoStanica,
    narudzbenica,
    examine,
    setExamine,
    sifraIspitivanja,
    message,
    setMessage,
  } = useContext(ReportContext);
  const [currentEl, setCurrentEl] = useState(null);
  const [ispEls, setIspEls] = useState(null);
  const [structure, setStructure] = useState(null);
  const [modal, setModal] = useState(false);
  const [baseFile, setBaseFile] = useState(null);
  const [fileTree, setFileTree] = useState(null);
  const [chartDataIsp, setChartDataIsp] = useState(null);
  const [loadData, setLoadData] = useState(false);
  const [ispPolja, setIspPolja] = useState(null);
  const brIzv = useRef();
  const datRef = useRef();
  const colors = ["Без напона", "Зелено", "Жуто", "Црвено", "", "Анализа"];
  let r_br = 0;

  const getElements = async () => {
    try {
      setLoadData(true);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/isp_elementi${narudzbenica.broj_narudzbenice}`
      );
      const jsonData = await response.json();
      setIspEls(jsonData.elementi);
      if (localStorage.getItem("currExamine"))
        setExamine(JSON.parse(localStorage.getItem("currExamine")));
    } catch (error) {
      setLoadData(false);
      setMessage("Greska na serveru...");
    } finally {
      let labelS = [0];
      for (let i = 0; i < 500; i++) {
        labelS.push((500 + i * 19) / 10);
      }
      let labelT = [-12];
      for (let i = 0; i < 600; i++) {
        labelT.push((-100 + i) / 10);
      }
      setChartDataIsp({
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
    setLoadData(false);
  };

  useEffect(() => {
    if (ispEls) {
      const filteredPolja = polja
        .map((item) => ({
          ...item,
          element: item.element?.filter((ele) =>
            ispEls.includes(ele.moja_sifra)
          ),
        }))
        .filter((item) => item.element?.length > 0);
      setIspPolja(filteredPolja);
      console.log(examine);
    }
  }, [ispEls]);

  const getStructure = async () => {
    if (sifraIspitivanja) {
      setLoadData(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/struktura${sifraIspitivanja}`
        );
        const jsonData = await response.json();
        // console.log(jsonData);
        setStructure(jsonData);
        setLoadData(false);
      } catch (error) {
        setMessage("greska na serveru");
        setLoadData(false);
      }
    }
  };

  useMemo(() => {
    if (narudzbenica) {
      getElements();
      getStructure();
    }
  }, [narudzbenica]);

  const resetData = () => {
    setModal(false);
    let sd = chartDataIsp;
    sd.us.dataF = [];
    sd.us.dataB = [];
    sd.ut.data = [];
    sd.luf = "";
    sd.lub = "";
    sd.lt = "";
    setChartDataIsp((ch) => ({
      ...sd,
    }));
    setCurrentEl(null);
    setBaseFile(null);
  };
  const promeni = (ele, no) => {
    setModal(false);
    let tempel = examine.map((e) => {
      if (e.moja_sifra === ele) {
        return { ...e, isp: no };
      } else return e;
    });
    if (no !== 5) {
      localStorage.setItem("currExamine", JSON.stringify(tempel));
      localStorage.setItem(ele, JSON.stringify(chartDataIsp));
    }
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
      setLoadData(true);
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
        brI: brIzv.current.value,
        dat: datRef.current.value,
      };
      // console.log(dataIsp);
      try {
        const response2 = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/stanje`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataIsp),
          }
        );
        if (response2.status === 210) {
          setMessage("primljeno");
          localStorage.clear();
          setLoadData(false);
        } else {
          setMessage("neka greska...");
          setLoadData(false);
          return;
        }
      } catch (error) {
        setMessage("greska na serveru");
        setLoadData(false);
      }
    }
  };

  const displayFile = async (f) => {
    // console.log(f);
    const fileData = {
      dir: `ISP${sifraIspitivanja}`,
      fName: f,
    };
    setLoadData(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/route${fileData}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fileData),
        }
      );
      const jsonData = await response.json();
      const text = jsonData;
      let dF = [null],
        dT = [null];
      if (f?.includes("FREQ")) {
        setBaseFile(f.split(" ")[4].substring(1));
        f = f.substring(9);
        let a = text.split("</Header>");
        a = a[1]?.split("\r\n<d>");
        for (let i = 1; i < a.length; i++) {
          if (parseFloat(a[i])) {
            let temp = a[i].split(",");
            dF.push(parseFloat(temp[1]));
          }
        }
        dF.pop();
        let sd = { ...chartDataIsp };
        sd.us.dataF = dF;
        sd.luf = f;
        setChartDataIsp(sd);
      } else if (f?.includes("SCOPE")) {
        f = f.substring(9);
        let a = text.split('<units am="dBm" />');
        let b = a[0].split('<Frequency units="MHz">');
        b = parseFloat(b[1]).toString() + " Mhz";
        a = a[1].split("\r\n");
        for (let i = 1; i < a.length; i++) {
          if (parseFloat(a[i].substring(7))) {
            dT.push(parseFloat(a[i].substring(7)));
          }
        }
        dT.pop();
        // console.log(dT);
        let sd = { ...chartDataIsp };
        sd.ut.data = dT;
        sd.lt = f + " (Frequency " + b;
        setChartDataIsp(sd);
        setLoadData(false);
      } else {
        setMessage("Greska u citanju fajla...");
        setLoadData(false);
      }
    } catch (error) {
      setMessage("greska na serveru");
      setLoadData(false);
    }
  };

  const displayBase = async (f) => {
    // console.log(f);
    const fileData = {
      dir: `ISP${sifraIspitivanja}`,
      fName: f,
    };
    setLoadData(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/route${fileData}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fileData),
        }
      );
      const jsonData = await response.json();
      const text = jsonData;
      let d = [null];
      let a = text.split("</Header>");
      a = a[1].split("\r\n<d>");
      for (let i = 1; i < a.length; i++) {
        if (parseFloat(a[i])) {
          let temp = a[i].split(",");
          d.push(parseFloat(temp[1]));
        }
      }
      d.pop();
      let sd = { ...chartDataIsp };
      sd.us.dataB = d;
      sd.lub = f;
      setChartDataIsp(sd);
      setLoadData(false);
    } catch (error) {
      setMessage("Greska na serveru");
      setLoadData(false);
    }
  };
  useMemo(() => {
    if (baseFile) {
      let file = structure[`${baseFile}.pdsx`][0];
      displayBase(file);
    }
  }, [baseFile]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        columnGap: "50px",
      }}
    >
      {loadData && <Spinner />}
      <div
        className="modal"
        style={{ display: modal ? "block" : "none", zIndex: "1" }}
      ></div>
      {modal ? (
        <div
          style={{
            display: "flex",
            position: "fixed",
            flexDirection: "column",
            padding: "5px",
            width: "12cm",
            left: "6cm",
            top: "10cm",
            backgroundColor: "rgb(209,211,211)",
            border: "2px solid black",
            opacity: "1",
            zIndex: "2",
            borderRadius: "10px",
          }}
        >
          <p
            style={{ right: "0.5cm", cursor: "pointer" }}
            onClick={() => {
              setLoadData(false);
              setModal(false);
            }}
          >
            X
          </p>
          {structure[fileTree]?.map((f, indf) => {
            return (
              <p
                style={{ color: "blue", cursor: "pointer" }}
                key={indf}
                onClick={() => displayFile(f)}
              >
                {f}
              </p>
            );
          })}
        </div>
      ) : null}
      {ispPolja ? (
        <div className="newContainer">
          {trafoStanica.napon.map((el, index) => {
            return (
              <div key={index}>
                <h3>Polja sa naponom {el} kV</h3>
                {ispPolja
                  .filter((x) => {
                    r_br = 1;
                    return parseInt(x.napon) === parseInt(el) && x.element;
                  })
                  .map((polje, idxP) => {
                    return (
                      <div className="newReportMain" key={idxP}>
                        <div
                          style={{
                            margin: "auto",
                            width: "99%",
                            height: "98%",
                          }}
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
                              return (
                                e.broj_polja === polje.broj_polja &&
                                ispEls.includes(e.moja_sifra)
                              );
                            })
                            .map((elpn, idxE) => {
                              return (
                                <div className="newReportSub" key={idxE}>
                                  <span>
                                    {elpn.el_skraceno.trim()}, {elpn.faza_opis}
                                  </span>
                                  <span>{`Sprat: ${elpn.moja_sifra.substring(
                                    8,
                                    9
                                  )}   Pozicija: ${elpn.moja_sifra.substring(
                                    15
                                  )}`}</span>
                                  <span
                                    style={{
                                      position: "absolute",
                                      left: "15px",
                                    }}
                                  >
                                    {r_br++}
                                  </span>
                                  <span
                                    onClick={() => {
                                      console.log(elpn);
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
                                          setChartDataIsp((ch) => ({
                                            ...JSON.parse(
                                              localStorage.getItem(
                                                elpn.moja_sifra
                                              )
                                            ),
                                          }));
                                        } else {
                                          setModal(true);
                                          setFileTree(elpn.us.substring(9, 12));
                                        }
                                      }
                                    }}
                                    onDoubleClick={() => {
                                      localStorage.removeItem(elpn.moja_sifra);
                                      promeni(currentEl?.sifra, 5);
                                    }}
                                    style={{
                                      backgroundColor:
                                        elpn.isp === 1
                                          ? "green"
                                          : elpn.isp === 2
                                          ? "yellow"
                                          : elpn.isp === 3
                                          ? "red"
                                          : elpn.moja_sifra === currentEl?.sifra
                                          ? "blue"
                                          : "white",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {ispEls?.includes(elpn.moja_sifra)
                                      ? colors[elpn.isp]
                                      : ""}
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
          <div
            style={{
              marginTop: "0.5cm",
              marginBottom: "1cm",
              width: "21cm",
              display: "grid",
              gridTemplateColumns: "5cm 5cm 5cm 5cm",
            }}
          >
            <span>Broj izvestaja</span>
            <input
              ref={brIzv}
              defaultValue={trafoStanica.naponski_nivo}
              style={{ width: "3cm" }}
            ></input>
            <span>Datum ispitivanja</span>
            <input style={{ width: "3cm" }} ref={datRef}></input>
          </div>
        </div>
      ) : null}
      <div className="diagram">
        <div style={{ color: "blue", fontWeight: "bold" }}>
          Поље {currentEl?.oznakaEl}, {currentEl?.element} Фаза{" "}
          {currentEl?.fazaEl}
        </div>
        <PrintGraph chartData={chartDataIsp} setChartData={setChartDataIsp} />
        <div style={{ marginTop: "20px" }}>
          <button
            style={{ width: "110px", backgroundColor: "green" }}
            onClick={() => promeni(currentEl?.sifra, 1)}
          >
            Zeleno
          </button>
          <button
            style={{ width: "110px", backgroundColor: "yellow" }}
            onClick={() => promeni(currentEl?.sifra, 2)}
          >
            Žuto
          </button>
          <button
            style={{ width: "110px", backgroundColor: "red" }}
            onClick={() => promeni(currentEl?.sifra, 3)}
          >
            Crveno
          </button>
          <button
            style={{ width: "110px", backgroundColor: "white" }}
            onClick={() => resetData()}
          >
            Resetuj
          </button>
        </div>
        <button
          className="block-btn"
          style={{ width: "480px", alignSelf: "center" }}
          onClick={() => submitIsp()}
        >
          Upiši u bazu
        </button>
      </div>
    </div>
  );
};

export default Ispitivanje;
