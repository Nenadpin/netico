import { useMemo, useRef } from "react";
import { useContext, useState } from "react";
import { addObject, getAllObjects, getValue, deleteObject } from "./IndexDB";
import ReportContext from "../Context";
import PrintGraph from "./PrintGraph";
import Spinner from "./Spinner";
import { useEffect } from "react";
import PrintHits from "./PrintHits";

const Ispitivanje = () => {
  const {
    polja,
    trafoStanica,
    narudzbenica,
    examine,
    setExamine,
    sifraIspitivanja,
    logout,
    setMessage,
    role,
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
  const [reportCount, setReportCount] = useState(null);
  const brIzv = useRef();
  const datRef = useRef();
  const colors = [
    "Без напона",
    "Зелено",
    "Жуто",
    "Црвено",
    "Љубичасто",
    "Анализа",
  ];
  const dbName = "analiza";
  const dbVersion = 1;
  let r_br = 0;

  const getElements = async () => {
    try {
      setLoadData(true);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/isp_elementi${narudzbenica.broj_narudzbenice}`
      );
      const jsonData = await response.json();
      setIspEls(jsonData.elementi.sort());
      console.log(jsonData);
      setReportCount(jsonData.broj_izvestaja);
    } catch (error) {
      setLoadData(false);
      setMessage(error.message);
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
        luh: "",
        us: {
          label: labelS,
          dataF: [],
          dataB: [],
        },
        ut: {
          label: labelT,
          data: [],
        },
        hits: {
          data: [],
        },
        bars: {
          data: [],
        },
      });
    }
    setLoadData(false);
  };
  const getStorage = async () => {
    const store = `ISP${sifraIspitivanja}`;
    const localData = await getAllObjects(dbName, dbVersion, store);
    if (localData.length && examine) {
      let tempel = [...examine];
      for (const data of localData) {
        tempel = tempel.map((e) => {
          if (e.moja_sifra === data.moja_sifra) {
            return { ...e, isp: data.isp };
          } else return e;
        });
      }
      setExamine(tempel);
    }
  };

  useEffect(() => {
    if (ispEls) {
      let filteredPolja = polja
        .filter((item) => item !== null)
        .map((item) => ({
          ...item,
          element: item.element?.filter((ele) =>
            ispEls.includes(ele.moja_sifra)
          ),
        }))
        .filter((item) => item.element?.length > 0);
      filteredPolja = filteredPolja.sort((a, b) => {
        const celijaA = a.celija_oznaka.trim();
        const celijaB = b.celija_oznaka.trim();
        if (celijaA < celijaB) {
          return -1;
        }
        if (celijaA > celijaB) {
          return 1;
        }
        return 0;
      });
      setIspPolja(filteredPolja);
      console.log(filteredPolja);
      getStorage();
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
        setStructure(jsonData);
        setLoadData(false);
      } catch (error) {
        setMessage(error.message);
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

  const backupIsp = async () => {
    const store = `ISP${sifraIspitivanja}`;
    const localData = await getAllObjects(dbName, dbVersion, store);
    const token = sessionStorage.getItem(role);
    setLoadData(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/isp_backup${sifraIspitivanja}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ analiza: localData }),
        }
      );
      if (response.status === 210) {
        setMessage("Backup ispitivanja je sacuvan");
        indexedDB.deleteDatabase(dbName);
        setLoadData(false);
        setTimeout(() => logout(), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.err.message);
        setLoadData(false);
      }
    } catch (error) {
      setMessage(error.message);
      setLoadData(false);
    }
  };
  const loadBackup = async () => {
    try {
      setLoadData(true);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/isp_elementi${narudzbenica.broj_narudzbenice}`
      );
      const jsonData = await response.json();
      const storage = jsonData.analiza.analiza;
      const store = `ISP${sifraIspitivanja}`;
      let key;
      if (storage) {
        for (const data of storage) {
          key = data.moja_sifra;
          await addObject(dbName, dbVersion, store, key, data);
        }
        setMessage("Ucitan je backUp iz baze");
        setTimeout(() => logout(), 3000);
      } else {
        setMessage("Ne postoji back-up trenutnog ispitivanja");
        setLoadData(false);
      }
    } catch (error) {
      setLoadData(false);
      setMessage("Greska na serveru, ili ne postoji backUp ispitivanja");
    }
  };

  const resetData = () => {
    setModal(false);
    let sd = chartDataIsp;
    sd.us.dataF = [];
    sd.us.dataB = [];
    sd.ut.data = [];
    sd.hits.data = [];
    sd.bars.data = [];
    sd.luf = "";
    sd.lub = "";
    sd.lt = "";
    sd.luh = "";
    setChartDataIsp(() => ({
      ...sd,
    }));
    setCurrentEl(null);
    setBaseFile(null);
  };
  const promeni = async (ele, no) => {
    setModal(false);
    const value = { ...chartDataIsp, isp: no, moja_sifra: ele };
    let tempel = examine.map((e) => {
      if (e.moja_sifra === ele) {
        return { ...e, isp: no };
      } else return e;
    });
    if (no !== 5) {
      const key = ele;
      const store = `ISP${sifraIspitivanja}`;
      await addObject(dbName, dbVersion, store, key, value);
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
      const store = `ISP${sifraIspitivanja}`;
      const localData = await getAllObjects(dbName, dbVersion, store);
      const dataIsp = {
        sifra: sifraIspitivanja,
        nar: narudzbenica.broj_narudzbenice,
        isp: localData,
        nap: trafoStanica.naponski_nivo,
        naz: `ТС ${trafoStanica.naponski_nivo.trim()} kV ${trafoStanica.naziv}`,
        brI: brIzv.current.value,
        dat: datRef.current.value,
      };
      const token = sessionStorage.getItem(role);
      try {
        const response2 = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/stanje`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            body: JSON.stringify(dataIsp),
          }
        );
        if (response2.status === 210) {
          setMessage("primljeno");
          indexedDB.deleteDatabase(dbName);
          setLoadData(false);
          setTimeout(() => logout(), 2000);
        } else {
          const errorData = await response2.json();
          setMessage(errorData.err.message);
          setLoadData(false);
          return;
        }
      } catch (error) {
        setMessage(error.message);
        setLoadData(false);
      }
    }
  };

  function parseRecord(hit) {
    let record = hit.split('="');
    return {
      x: parseFloat(record[2]) / 18,
      y: parseFloat(record[3]),
    };
  }

  const displayFile = async (f) => {
    const fileData = {
      dir: structure.dir,
      fName: f,
    };
    setLoadData(true);
    const token = sessionStorage.getItem(role);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/route${fileData}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", authorization: token },
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
        let sd = { ...chartDataIsp };
        sd.ut.data = dT;
        sd.lt = f + " (Frequency " + b;
        setChartDataIsp(sd);
        setLoadData(false);
      } else if (f?.includes("HITS")) {
        let Baza = [],
          tempBar = [];
        let a = text.split("\r\n");
        for (let i = 0; i < a.length; i++) {
          if (a[i].includes("<hit ts=")) {
            Baza.push(parseRecord(a[i]));
          } else if (
            a[i].includes("<RMS units=") &&
            parseFloat(a[i].split(">")[1]) > 0
          ) {
            tempBar[0] = parseFloat(a[i].split(">")[1]);
          } else if (
            a[i].includes("<Peak units=") &&
            parseFloat(a[i].split(">")[1]) > 0
          ) {
            tempBar[1] = parseFloat(a[i].split(">")[1]);
          } else if (
            a[i].includes("<F1 units=") &&
            parseFloat(a[i].split(">")[1]) > 0
          ) {
            tempBar[2] = parseFloat(a[i].split(">")[1]);
          } else if (
            a[i].includes("<F2 units=") &&
            parseFloat(a[i].split(">")[1]) > 0
          ) {
            tempBar[3] = parseFloat(a[i].split(">")[1]);
          }
        }
        let sh = { ...chartDataIsp };
        sh.hits.data = Baza;
        sh.bars.data = tempBar;
        sh.luh = f;
        setChartDataIsp(sh);
        setLoadData(false);
      } else {
        setMessage("Greska u citanju fajla...");
        setLoadData(false);
      }
    } catch (error) {
      setMessage(error.message);
      setLoadData(false);
    }
  };

  const displayBase = async (f) => {
    const fileData = {
      dir: structure.dir,
      fName: f,
    };
    setLoadData(true);
    const token = sessionStorage.getItem(role);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/route${fileData}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", authorization: token },
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
      setMessage(error.message);
      setLoadData(false);
    }
  };
  useMemo(() => {
    if (baseFile) {
      let file = structure[`${baseFile}.pdsx`][0];
      displayBase(file);
    }
  }, [baseFile]);

  const getGrapf = async (e, p) => {
    const store = `ISP${sifraIspitivanja}`;
    const data = await getValue(dbName, dbVersion, store, e);
    console.log(dbName, dbVersion, store, e, data);
    if (data) {
      setChartDataIsp(data);
    } else {
      setModal(true);
      setFileTree(p);
    }
  };

  const deleteGraph = async (e) => {
    const store = `ISP${sifraIspitivanja}`;
    await deleteObject(dbName, dbVersion, store, e);
    resetData();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        columnGap: "50px",
      }}
    >
      {loadData && <Spinner message={"Snimanje podataka analize..."} />}
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
            maxHeight: "80vh",
            overflowY: "auto",
            left: "6cm",
            top: "4cm",
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
                onClick={() => {
                  displayFile(f);
                }}
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
                                  )}   Pozicija: ${elpn.moja_sifra.slice(
                                    -1
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
                                    onClick={(e) => {
                                      if (!e.ctrlKey) {
                                        if (ispEls?.includes(elpn.moja_sifra)) {
                                          setCurrentEl({
                                            element: elpn.el_skraceno,
                                            naponEl: el,
                                            oznakaEl: polje.celija_oznaka,
                                            sifra: elpn.moja_sifra,
                                            fazaEl: elpn.faza_opis,
                                            izolacija: elpn.isp,
                                          });
                                          getGrapf(
                                            elpn.moja_sifra,
                                            polje.celija_oznaka
                                          );
                                        }
                                      } else {
                                        promeni(elpn.moja_sifra, 5);
                                        deleteGraph(elpn.moja_sifra);
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
                                          : elpn.isp === 4
                                          ? "purple"
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
              defaultValue={reportCount}
              style={{ width: "4cm" }}
            ></input>
            <span>Datum ispitivanja</span>
            <input type="date" style={{ width: "4cm" }} ref={datRef}></input>
          </div>
        </div>
      ) : null}
      <div
        className="diagram"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <div
          style={{
            color: "blue",
            fontWeight: "bold",
          }}
        >
          Поље {currentEl?.oznakaEl}, {currentEl?.element} Фаза{" "}
          {currentEl?.fazaEl}
        </div>
        <PrintGraph chartData={chartDataIsp} />
        {chartDataIsp?.hits.data.length ? (
          <PrintHits chartData={chartDataIsp} />
        ) : null}
        <div style={{ marginTop: "250px" }}>
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
            style={{
              width: "110px",
              backgroundColor: "purple",
              color: "white",
            }}
            onClick={() => promeni(currentEl?.sifra, 4)}
          >
            Љубичасто
          </button>
          <button
            style={{ width: "110px", backgroundColor: "white" }}
            onClick={() => resetData()}
          >
            Resetuj
          </button>
        </div>
        <div>
          <button
            className="block-btn"
            style={{ width: "190px", alignSelf: "center" }}
            onClick={() => backupIsp()}
          >
            Back-up
          </button>
          <button
            className="block-btn"
            style={{ width: "190px", alignSelf: "center" }}
            onClick={() => loadBackup()}
          >
            Ucitaj Back-up
          </button>
          <button
            className="block-btn"
            style={{ width: "190px", alignSelf: "center" }}
            onClick={() => submitIsp()}
          >
            Upiši u bazu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ispitivanje;
