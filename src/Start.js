import React, { useEffect, useState, useContext } from "react";
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

const Start = () => {
  const [tsList, setTsList] = useState([]); // Lokalna lista trafostanica i ispitivanja

  const {
    role,
    trafoStanica,
    allOrders,
    ispList,
    narudzbenica,
    tipPrikaza,
    examine,
    orders,
    prev,
    sviUgovori,
    reports,
    setOrders,
    setKd,
    setSviUgovori,
    setEmplList,
    setIspList,
    setTrafoStanica,
    setPolja,
    setElHist,
    setNarudzbenica,
    setSifraIspitivanja,
    setTipPrikaza,
    setExamine,
    setReports,
    setAllOrders,
    setUgovor,
    setHistory,
    setPrev,
  } = useContext(ReportContext);
  const [filter, setFilter] = useState(false);
  const [dispOrd, setDispOrd] = useState(null);
  const [editOrd, setEdit] = useState(false);
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
      const response = await fetch(`http://localhost:5000/trafo_stanice`);
      const jsonData = await response.json();
      console.log(jsonData);
      setTsList(jsonData.trafo);
      setIspList(jsonData.ispitano);
      setOrders(jsonData.orders);
      setSviUgovori(jsonData.contracts);
      setKd(jsonData.kd);
      setEmplList(jsonData.empl);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getFields = async (e) => {
    try {
      const response = await fetch(`http://localhost:5000/detalji_stanice${e}`);
      const jsonData = await response.json();
      console.log(jsonData);
      setPolja(jsonData.fields);
      setNarudzbenica(jsonData.curr[0]);
      setExamine(jsonData.els);
      setAllOrders(jsonData.allOrd);
      setReports(jsonData.izv);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Kad se izabere TS, proverava istoriju ispitivanja
  //i vraca listu svih ispitivanja izabrane TS
  // i na kraju se formira globalno stanje trafoStanice

  const checkHistory = async (ord_no) => {
    let ts_no = orders.filter((o) => {
      return o.broj_narudzbenice === ord_no;
    })[0].sifra_ts;

    await getFields(ts_no);
    let newTS = tsList.filter((e) => {
      return e.sifra_ts === ts_no;
    });
    newTS[0].napon = newTS[0].naponski_nivo.trim().split("/");
    setTrafoStanica(newTS[0]);
    // // setNarudzbenica(
    // //   orders.filter((o) => {
    // //     return (o.broj_narudzbenice = ord_no);
    // //   })[0]
    // );
    const tmp = ispList
      .filter((ex) => {
        return ex.sifra_ts === ts_no;
      })
      .sort((b, c) => {
        return b.r_br - c.r_br;
      });
    if (tmp.length) setPrev(tmp);
    else {
      setPrev([]);
    }
  };

  const prikazi = (x, y) => {
    let temp1 = {};
    let temp = examine
      .map((h) => {
        return h.history?.filter((e) => {
          return e.sifra_ispitivanja === `ISP${y}`;
        });
      })
      .filter((f) => {
        return f.length > 0;
      });
    for (let i = 0; i < temp.length; i++) {
      if (temp[i][0].stanje_izolacije !== 5) {
        temp1[temp[i][0].us] = temp[i][0].stanje_izolacije;
      }
    }
    setHistory(temp1);
    setElHist(x);
    setTipPrikaza(1);
  };

  const izvestaj = (x, isp) => {
    let temp1 = {};
    let temp = examine
      .map((h) => {
        return h.history?.filter((e) => {
          return e.sifra_ispitivanja === `ISP${isp}`;
        });
      })
      .filter((f) => {
        return f.length > 0;
      });
    for (let i = 0; i < temp.length; i++) {
      if (
        temp[i][0].stanje_izolacije !== 5 &&
        temp[i][0].stanje_izolacije !== 0
      ) {
        temp1[temp[i][0].us] = temp[i][0].stanje_izolacije;
      }
    }
    console.log(temp1);
    setHistory(temp1);
    setElHist(x);
    if (!narudzbenica)
      setNarudzbenica(
        allOrders.filter((ord) => {
          return ord.sifra_ts === trafoStanica.sifra_ts;
        })[0]
      );
    const conCurr = allOrders.filter((ord) => {
      return ord.broj_narudzbenice === narudzbenica?.broj_narudzbenice;
    });
    const contract = sviUgovori.filter((c) => {
      return c.oznaka === conCurr[0]?.sifra_ugovora;
    });
    setUgovor(contract[0]);
    setTipPrikaza(6);
    setSifraIspitivanja(isp);
  };
  const filterTS = (choice) => {
    let ispOrders = orders;
    switch (choice) {
      case "isp": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno === "upisano";
        });
        break;
      }
      case "nova": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno === "nova";
        });
        break;
      }
      case "nalog": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno === "nalog";
        });
        break;
      }
      case "zapisnik": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno === "zapisnik";
        });
        break;
      }
      case "new": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno === "zavrseno";
        });
        break;
      }
      case "current": {
        ispOrders = ispOrders.filter((o) => {
          return o.operativno !== "zavrseno" && o.operativno !== "greska";
        });
        break;
      }
      default:
        ispOrders = [];
    }
    setDispOrd(ispOrders);
    setFilter(true);
  };

  return (
    <>
      <div className="headerStart">
        <img src={logo} alt="logotip"></img>
        <h2>Парцијална пражњења</h2>
        {!role ? <Login /> : null}
        {role === "admin" ? (
          <div>
            <button
              onClick={() => {
                setEdit(false);
                filterTS("new");
              }}
            >
              Завршено
            </button>
            <button
              onClick={() => {
                setEdit(true);
                filterTS("current");
              }}
            >
              У Току
            </button>
          </div>
        ) : role === "operator" ? (
          <div>
            <button onClick={() => filterTS("zapisnik")}>Записник</button>
          </div>
        ) : role === "expert" ? (
          <div>
            <button onClick={() => filterTS("isp")}>Испитивање</button>
          </div>
        ) : role === "tech" ? (
          <div>
            <button onClick={() => filterTS("new")}>Наруџбеница</button>
            <button onClick={() => filterTS("nova")}>Налог</button>
            <button
              onClick={() => {
                setFilter(false);
                setTipPrikaza(0);
              }}
            >
              Нова ТС
            </button>
            <button>Унос фајлова</button>
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
            {dispOrd.length
              ? dispOrd.map((ord, index) => (
                  <option key={index} value={ord.broj_narudzbenice}>
                    {ord.sifra_ts} - {ord.broj_narudzbenice}
                  </option>
                ))
              : null}
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
                      setSifraIspitivanja(x.r_br);
                      prikazi(idx, x.r_br);
                    }}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    Datum: {x.datum} Ispitivanje br: {x.r_br}
                  </span>
                  {reports && narudzbenica?.stavke ? (
                    <span
                      onClick={() => izvestaj(idx, x.r_br)}
                      style={{
                        cursor: "pointer",
                        color: "green",
                        marginLeft: "1cm",
                      }}
                    >
                      Izvestaj
                    </span>
                  ) : null}
                </p>
              );
            })}
          </>
        ) : null}
        {editOrd ? (
          <p
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => setTipPrikaza(2)}
          >
            Izmena narudzbenice
          </p>
        ) : null}
        {trafoStanica.sifra_ts && role !== "admin" && tipPrikaza !== 0 ? (
          <span>
            {narudzbenica?.operativno === "nova" && filter ? (
              <h4
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => setTipPrikaza(3)}
              >
                Nalog
              </h4>
            ) : narudzbenica?.operativno === "nalog" && filter ? (
              <h4
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => {
                  if (ispList.length) {
                    let sifra = ispList.filter((i) => {
                      return i.narudzbenica === narudzbenica.broj_narudzbenice;
                    })[0]?.r_br;
                    setSifraIspitivanja(sifra);
                  }
                  setTipPrikaza(4);
                }}
              >
                Zapisnik
              </h4>
            ) : narudzbenica?.operativno === "upisano" && filter ? (
              <h4
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => {
                  let sifra = ispList.filter((i) => {
                    return i.narudzbenica === narudzbenica.broj_narudzbenice;
                  })[0].r_br;
                  setSifraIspitivanja(sifra);
                  setTipPrikaza(5);
                }}
              >
                Ispitivanje
              </h4>
            ) : (
              <h4
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => setTipPrikaza(2)}
              >
                Narudzbenica
              </h4>
            )}
          </span>
        ) : null}
      </div>
      {tipPrikaza === 1 ? (
        <NewReport />
      ) : tipPrikaza === 2 ? (
        <Order />
      ) : tipPrikaza === 3 ? (
        <Nalog />
      ) : tipPrikaza === 4 ? (
        <Zapisnik />
      ) : tipPrikaza === 5 ? (
        <Ispitivanje />
      ) : tipPrikaza === 6 ? (
        <Report />
      ) : tipPrikaza === 0 ? (
        <NewTS />
      ) : null}
    </>
  );
};

export default Start;
