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

const Start = () => {
  const [tsList, setTsList] = useState([]); // Lokalna lista trafostanica i ispitivanja
  const [prev, setPrev] = useState([]); // Lokalna lista prethodnih ispitivanja

  const {
    trafoStanica,
    allOrders,
    ispList,
    narudzbenica,
    tipPrikaza,
    examine,
    sviUgovori,
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
    setPageCount,
  } = useContext(ReportContext);

  // Na ucitavanju stranice, prikuplja podatke
  // sa backenda o svim TS i ispitivanjima
  useEffect(() => {
    getStart();
  }, []);

  //Kad se izabere trafoStanica, ucitavaju se sa servera podaci o poljima
  //i elementima (ako je novo ispitivanje) ili podaci o stanjima elemenata
  //kod prethodnih ispitivanja. Podaci o elementima su umetnuti u niz polja.

  const getStart = async () => {
    try {
      const response = await fetch("http://localhost:5000/trafo_stanice");
      const jsonData = await response.json();
      console.log(jsonData);
      setTsList(jsonData.trafo);
      setIspList(jsonData.ispitano);
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

  const checkHistory = async (ts_no) => {
    await getFields(ts_no);
    let newTS = tsList.filter((e) => {
      return e.sifra_ts === ts_no;
    });
    newTS[0].napon = newTS[0].naponski_nivo.trim().split("/");
    setTrafoStanica(newTS[0]);
    const tmp = ispList
      .filter((ex) => {
        return ex.sifra_ts === ts_no;
      })
      .sort((b, c) => {
        return b.r_br - c.r_br;
      });
    console.log(tmp);
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

  return (
    <>
      <div className="headerStart">
        <img src={logo} alt="logotip"></img>
        <h2>Ispitivanja trafo stanica!</h2>
        <h4>
          Trafo stanica:{" "}
          <select
            onFocus={(e) => {
              setTipPrikaza(0);
              e.target.selectedIndex = 0;
            }}
            autoFocus
            type="text"
            onChange={(e) => checkHistory(e.target.value)}
          >
            <option disabled={true} value="">
              --TRAFO STANICA--
            </option>
            {tsList.length
              ? tsList.map((ts, index) => (
                  <option key={index} value={ts.sifra_ts}>
                    {ts.naponski_nivo}kV {ts.naziv}
                  </option>
                ))
              : null}
          </select>
        </h4>
        {prev.length && tipPrikaza !== 5 ? (
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
                  {narudzbenica?.stavke ? (
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
        {trafoStanica.sifra_ts ? (
          <span>
            {narudzbenica?.operativno === "nova" ? (
              <h4
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => setTipPrikaza(3)}
              >
                Nalog
              </h4>
            ) : narudzbenica?.operativno === "nalog" ? (
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
            ) : narudzbenica?.operativno === "upisano" ? (
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
