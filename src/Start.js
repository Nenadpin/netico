import React, { useEffect, useState, useContext, useRef } from "react";
import Order from "./components/Order";
import NewReport from "./components/NewReport";
import ReportContext from "./Context";
import logo from "./logo.png";
import Zapisnik from "./components/Zapisnik";
import Nalog from "./components/Nalog";
import Ispitivanje from "./components/Ispitivanje";
import Report from "./components/Report";
import NewTS from "./components/NewTS";
import Login from "./components/Login";
import Upload from "./components/Upload";

const Start = () => {
  const [tsList, setTsList] = useState([]); // Lokalna lista trafostanica i ispitivanja
  const passRef = useRef();
  const confirm = useRef();
  const {
    role,
    neticoUser,
    trafoStanica,
    ispList,
    narudzbenica,
    tipPrikaza,
    examine,
    orders,
    prev,
    sviUgovori,
    sifraIspitivanja,
    setOrders,
    setPrev,
    setKd,
    setSviUgovori,
    setEmplList,
    setIspList,
    setTrafoStanica,
    setPolja,
    setNarudzbenica,
    setSifraIspitivanja,
    setTipPrikaza,
    setExamine,
    setReports,
    setUgovor,
    setHistory,
  } = useContext(ReportContext);
  const [filter, setFilter] = useState(false);
  const [dispOrd, setDispOrd] = useState(null);
  const [editOrd, setEdit] = useState(false);
  const [upload, setUpload] = useState(false);
  const [editZap, setEditZap] = useState(false);
  const [changePass, setChangePass] = useState(false);
  // Na ucitavanju stranice, prikuplja podatke
  // sa backenda o svim TS i ispitivanjima
  useEffect(() => {
    if (role) getStart();
  }, [role]);

  //Kad se izabere trafoStanica, ucitavaju se sa servera podaci o poljima
  //i elementima (ako je novo ispitivanje) ili podaci o stanjima elemenata
  //kod prethodnih ispitivanja. Podaci o elementima su umetnuti u niz polja.

  const getStart = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/trafo_stanice`
      );
      const jsonData = await response.json();
      // console.log(jsonData);
      setTsList(jsonData.trafo);
      setIspList(jsonData.ispitano);
      setOrders(jsonData.orders);
      setSviUgovori(jsonData.contracts);
      setKd(jsonData.kd);
      setEmplList(jsonData.empl);
    } catch (err) {
      alert("greska na serveru");
    }
  };

  // Kad se izabere TS, proverava istoriju ispitivanja
  //i vraca listu svih ispitivanja izabrane TS
  // i na kraju se formira globalno stanje trafoStanice

  const checkHistory = async (ord_no) => {
    let nar = orders.filter((o) => {
      return o.broj_narudzbenice === ord_no;
    })[0];
    if (editZap) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/izmena_zap`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nar),
          }
        );
        if (response.status === 210) {
          alert("Zapisnik je potrebno ponoviti...");
          window.location.reload();
        } else if (response.status === 501) alert("Greska na serveru");
      } catch (err) {
        console.log(err);
      }
    }
    if (role !== "admin" || editOrd) setNarudzbenica({ ...nar });
    let ts_no = nar.sifra_ts;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/detalji_stanice${ts_no}`
      );
      const jsonData = await response.json();
      // console.log(jsonData);
      setPolja(jsonData.fields);
      setExamine(jsonData.els);
      setReports(jsonData.izv);
    } catch (err) {
      alert("Greska na serveru...");
    }
    let tmp = [...ispList];
    if (role === "admin")
      tmp = tmp.filter((ex) => {
        return ex.sifra_ts === ts_no;
      });
    else
      tmp = tmp.filter((ex) => {
        return ex.sifra_ts === ts_no && ex.narudzbenica === ord_no;
      });
    if (tmp.length) setPrev(tmp);
    else {
      setPrev([]);
    }
    let newTS = tsList.filter((e) => {
      return e.sifra_ts === ts_no;
    });
    newTS[0].napon = newTS[0].naponski_nivo.trim().split("/");
    setTrafoStanica({ ...newTS[0] });
  };

  const techOps = (ts_no) => {
    let newTS = tsList.filter((e) => {
      return e.sifra_ts === ts_no;
    });
    newTS[0].napon = newTS[0].naponski_nivo.trim().split("/");
    setTrafoStanica({ ...newTS[0] });
    if (!narudzbenica) setTipPrikaza(2);
  };

  const prikazi = (y) => {
    if (y < 10) {
      y = "00" + y;
    } else if (y < 100) {
      y = "0" + y;
    }
    let temp1 = {};
    let temp = examine
      .map((h) => {
        return h.history?.filter((e) => {
          return e.sifra_ispitivanja === `ISP${y}`;
        });
      })
      .filter((f) => {
        return f?.length > 0;
      });
    for (let i = 0; i < temp.length; i++) {
      if (temp[i][0].stanje_izolacije !== 5) {
        temp1[temp[i][0].us] = temp[i][0].stanje_izolacije;
      }
    }
    // console.log(temp1);
    setHistory(temp1);
    setTipPrikaza(1);
  };

  const izvestaj = () => {
    let temp1 = {};
    let temp = examine
      .map((h) => {
        return h.history?.filter((e) => {
          return e.sifra_ispitivanja === `ISP${sifraIspitivanja}`;
        });
      })
      .filter((f) => {
        return f?.length > 0;
      });
    for (let i = 0; i < temp.length; i++) {
      if (
        temp[i][0].stanje_izolacije !== 5 &&
        temp[i][0].stanje_izolacije !== 0
      ) {
        temp1[temp[i][0].us] = temp[i][0].stanje_izolacije;
      }
    }
    setHistory(temp1);
    const contract = sviUgovori.filter((c) => {
      return c.oznaka === narudzbenica?.sifra_ugovora;
    });
    setUgovor(contract[0]);
    setTipPrikaza(6);
  };

  const filterTS = (choice) => {
    let ispOrders = orders;
    switch (choice) {
      case "isp": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno === "uploaded";
        });
        setDispOrd([...ispOrders]);
        if (ispOrders.length) break;
        else return;
      }
      case "upload": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno === "upisano";
        });
        setDispOrd([...ispOrders]);
        if (ispOrders.length) break;
        else return;
      }
      case "nova": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno === "nova";
        });
        setDispOrd([...ispOrders]);
        if (ispOrders.length) break;
        else return;
      }
      case "nalog": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno === "nalog";
        });
        setDispOrd([...ispOrders]);
        if (ispOrders.length) break;
        else return;
      }
      case "new": {
        let lista = [];
        let ctrl = [];
        for (let i = 0; i < ispOrders.length; i++) {
          if (
            ispOrders[i].operativno === "zavrseno" &&
            !ctrl.includes(ispOrders[i].sifra_ts)
          ) {
            lista.push(ispOrders[i]);
            ctrl.push(ispOrders[i].sifra_ts);
          }
        }
        setDispOrd([...lista]);
        if (ispOrders.length) break;
        else return;
      }
      case "current": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno !== "zavrseno" && o.operativno !== "greska";
        });
        setDispOrd([...ispOrders]);
        if (ispOrders.length) break;
        else return;
      }
      default:
        ispOrders = [];
    }
    if (!ispOrders.length) setTipPrikaza(2);
    setFilter(true);
  };
  const changePassword = async () => {
    if (
      passRef.current.value &&
      passRef.current.value === confirm.current.value
    )
      try {
        const name = neticoUser;
        const pass = passRef.current.value;
        const body = { name, pass };
        const loginRes = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/change`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        if (loginRes.status === 501) alert("pogresna lozinka...");
        else if (loginRes.status === 210) {
          alert("Lozinka je uspesno promenjena");
          setChangePass(false);
        }
      } catch (err) {
        alert("Greska na serveru!");
      }
    else alert("Unesite i potvrdite novu lozinku");
  };

  return (
    <>
      <div
        className="headerStart"
        style={{
          width: tipPrikaza === 1 || tipPrikaza === 5 ? "21cm" : "100%",
        }}
      >
        <img src={logo} alt="logotip"></img>
        <h2>Parcijalna praznjenja</h2>
        {neticoUser ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "baseline",
            }}
          >
            <h6
              style={{
                marginBottom: "1rem",
                cursor: role ? "pointer" : "not-allowed",
              }}
              onClick={() => {
                if (role) setChangePass(true);
              }}
            >
              User: {neticoUser}
            </h6>
            {changePass ? (
              <>
                <input
                  style={{
                    height: "1.5rem",
                    width: "3cm",
                    marginLeft: "0.5cm",
                  }}
                  type="password"
                  ref={passRef}
                  placeholder="Nova lozinka"
                ></input>
                <input
                  style={{
                    height: "1.5rem",
                    width: "3cm",
                    marginLeft: "0.5cm",
                  }}
                  type="password"
                  ref={confirm}
                  placeholder="Ponovi lozinku"
                ></input>
                <button
                  style={{ backgroundColor: "green" }}
                  onClick={changePassword}
                >
                  DA
                </button>
                <button
                  style={{ color: "red" }}
                  onClick={() => setChangePass(false)}
                >
                  NE
                </button>
              </>
            ) : null}
          </div>
        ) : null}
        {!role ? <Login /> : null}
        {role === "admin" ? (
          <div>
            <button
              onClick={() => {
                setTrafoStanica({});
                setNarudzbenica(null);
                setChangePass(false);
                setPrev([]);
                setEdit(false);
                filterTS("new");
              }}
            >
              Zavrseno
            </button>
            <button
              onClick={() => {
                setTrafoStanica({});
                setPrev([]);
                setEdit(true);
                setChangePass(false);
                filterTS("current");
              }}
            >
              U Toku
            </button>
          </div>
        ) : role === "operator" ? (
          <div>
            <button
              onClick={() => {
                setChangePass(false);
                filterTS("nalog");
              }}
            >
              Zapisnik sa terena
            </button>
            <button
              onClick={() => {
                setChangePass(false);
                filterTS("upload");
                setUpload(true);
              }}
            >
              Unos fajlova
            </button>
            <button
              onClick={() => {
                setChangePass(false);
                filterTS("upload");
                setEditZap(true);
              }}
            >
              Ispravka zapisnika
            </button>
          </div>
        ) : role === "expert" ? (
          <div>
            <button
              onClick={() => {
                setChangePass(false);
                filterTS("isp");
              }}
            >
              Analiza
            </button>
          </div>
        ) : role === "tech" ? (
          <div>
            <button
              onClick={() => {
                setChangePass(false);
                setUpload(false);
                filterTS("nova");
                // console.log(filter, narudzbenica?.operativno);
              }}
            >
              Nalog
            </button>
            <button
              onClick={() => {
                setChangePass(false);
                setFilter(false);
                setUpload(false);
                setTipPrikaza(0);
              }}
            >
              Nova TS
            </button>
          </div>
        ) : null}
        {dispOrd?.length && filter ? (
          <select
            onFocus={(e) => {
              setTipPrikaza(null);
              setNarudzbenica(null);
              e.target.selectedIndex = 0;
            }}
            autoFocus
            type="text"
            onChange={(e) => checkHistory(e.target.value)}
          >
            <option disabled={true} value="">
              --NARUDZBENICA--
            </option>
            {dispOrd.map((ord, index) => (
              <option key={index} value={ord.broj_narudzbenice}>
                {ord.sifra_ts} - {ord.naziv.substring(0, 30)}{" "}
                {ord.operativno !== "zavrseno"
                  ? `нзн: ${ord.broj_narudzbenice?.substring(0, 10)} `
                  : ""}
                {ord.operativno !== "zavrseno" ? ord.operativno : ""}
              </option>
            ))}
          </select>
        ) : null}
        {role === "tech" && !dispOrd ? (
          <select
            onFocus={(e) => {
              setTipPrikaza(null);
              setNarudzbenica(null);
              e.target.selectedIndex = 0;
            }}
            autoFocus
            type="text"
            onChange={(e) => techOps(e.target.value)}
          >
            <option disabled={true} value="">
              --NOVA NARUDZBENICA--
            </option>
            {tsList.map((ts, index) => (
              <option key={index} value={ts.sifra_ts}>
                {ts.sifra_ts} - {ts.naziv}
              </option>
            ))}
          </select>
        ) : null}
        {prev.length && tipPrikaza !== 5 && role === "admin" && !editOrd ? (
          <>
            <h6>Prethodna ispitivanja:</h6>
            {prev.map((x, idx) => {
              return (
                <p key={idx}>
                  <span
                    onClick={() => {
                      setChangePass(false);
                      setSifraIspitivanja(x.r_br);
                      setNarudzbenica(
                        orders.filter(
                          (o) => o.broj_narudzbenice === x.narudzbenica
                        )[0]
                      );
                      prikazi(x.r_br);
                    }}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    Datum: {x.datum} Ispitivanje br: {x.r_br}
                  </span>
                </p>
              );
            })}
            {narudzbenica?.operativno === "zavrseno" && narudzbenica.stavke ? (
              <p
                style={{
                  cursor: "pointer",
                  color: "green",
                  marginLeft: "1cm",
                }}
                onClick={() => {
                  setChangePass(false);
                  izvestaj();
                }}
              >
                Stampanje izvestaja za isptitivanje br: {sifraIspitivanja}
              </p>
            ) : null}
          </>
        ) : null}
        {editOrd && trafoStanica?.sifra_ts ? (
          <p
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => {
              setChangePass(false);
              setTipPrikaza(2);
            }}
          >
            Izmena narudzbenice
          </p>
        ) : null}
        {trafoStanica.sifra_ts && role !== "admin" && tipPrikaza !== 0 ? (
          <span>
            {narudzbenica?.operativno === "nova" && filter ? (
              <h4
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => {
                  setChangePass(false);
                  setTipPrikaza(3);
                }}
              >
                Nalog
              </h4>
            ) : narudzbenica?.operativno === "nalog" && filter ? (
              <h4
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => {
                  setChangePass(false);
                  if (ispList.length) {
                    let sifra = ispList.filter((i) => {
                      return i.narudzbenica === narudzbenica.broj_narudzbenice;
                    })[0]?.r_br;
                    setSifraIspitivanja(sifra);
                  }
                  setTipPrikaza(4);
                }}
              >
                Zapisnik sa terena
              </h4>
            ) : narudzbenica?.operativno === "uploaded" && filter && !upload ? (
              <h4
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => {
                  setChangePass(false);
                  let sifra = ispList.filter((i) => {
                    return i.narudzbenica === narudzbenica.broj_narudzbenice;
                  })[0].r_br;
                  setSifraIspitivanja(sifra);
                  setTipPrikaza(5);
                }}
              >
                Pokreni
              </h4>
            ) : null}
          </span>
        ) : null}
      </div>
      {tipPrikaza === 1 && trafoStanica.sifra_ts ? (
        <NewReport />
      ) : tipPrikaza === 2 && trafoStanica.sifra_ts ? (
        <Order />
      ) : tipPrikaza === 3 && trafoStanica.sifra_ts ? (
        <Nalog />
      ) : tipPrikaza === 4 && trafoStanica.sifra_ts ? (
        <Zapisnik />
      ) : tipPrikaza === 5 && trafoStanica.sifra_ts ? (
        <Ispitivanje />
      ) : tipPrikaza === 6 && trafoStanica.sifra_ts ? (
        <Report />
      ) : tipPrikaza === 0 ? (
        <NewTS />
      ) : null}
      {upload && trafoStanica.sifra_ts ? <Upload /> : null}
    </>
  );
};

export default Start;
