import React, { useRef, useState } from "react";
import { useContext } from "react";
import ReportContext from "../Context";
import { useEffect } from "react";

const Nalog = () => {
  const datumIsp = useRef();
  const sifraIsp = useRef();
  const [tim, setTim] = useState({ r: "", i1: "", i2: "" });
  const {
    trafoStanica,
    narudzbenica,
    emplList,
    ispList,
    setMessage,
    logout,
    role,
  } = useContext(ReportContext);
  useEffect(() => {
    if (ispList && narudzbenica) {
      let sifra = "001";
      const noIsp = ispList.filter(
        (i) => i.ugovor?.trim() === narudzbenica.sifra_ugovora.trim()
      );
      if (noIsp.length > 0)
        sifra = (noIsp.length + 1).toString().padStart(3, "0");
      sifraIsp.current.value = sifra;
    }
  }, []);

  const rukovodilac = (x) => {
    let tmp = tim;
    tmp.r = x;
    setTim(tmp);
  };
  const izvrsilac1 = (x) => {
    let tmp = tim;
    tmp.i1 = x;
    setTim(tmp);
  };
  const izvrsilac2 = (x) => {
    let tmp = tim;
    tmp.i2 = x;
    setTim(tmp);
  };
  const handleNalog = async () => {
    const token = sessionStorage.getItem(role);
    console.log(ispList.length);
    if (!datumIsp.current.value) datumIsp.current.value = "";
    if (tim.r && tim.i1 && sifraIsp && token) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/nalog`,
          {
            method: "POST",
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify([
              ispList.length + 1,
              narudzbenica.broj_narudzbenice,
              narudzbenica.sifra_ugovora,
              sifraIsp.current.value,
              tim.r,
              tim.i1,
              tim.i2,
              datumIsp.current.value,
            ]),
          }
        );
        if (response.status === 210) {
          setMessage("primljeno");
          setTimeout(() => logout(), 2000);
        } else {
          const errorData = await response.json();
          setMessage(errorData.err.message);
          return;
        }
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Nalog za ispitivanje trafo stanice!</h2>
      <h4>
        Na osnovu narudzbenice br: {narudzbenica.broj_narudzbenice} po ugovoru{" "}
        {narudzbenica.sifra_ugovora} izdaje se nalog za izradu zapisnika u
        trafostanici {trafoStanica.naponski_nivo.trim()} kV {trafoStanica.naziv}
      </h4>
      <br />
      <div className="nalog">
        <h4>Broj ispitivanja:({narudzbenica.sifra_ugovora})</h4>
        <span>
          <input
            disabled
            type="text"
            ref={sifraIsp}
            style={{
              fontSize: "large",
              marginBottom: "5px",
              height: "2rem",
              width: "100%",
            }}
          ></input>
        </span>
        <h4>Rukovodilac: </h4>
        <span>
          {" "}
          {emplList ? (
            <select
              style={{
                fontSize: "large",
                marginBottom: "5px",
                height: "2rem",
                width: "100%",
              }}
              onFocus={(e) => {
                e.target.selectedIndex = 0;
              }}
              onChange={(e) => rukovodilac(e.target.value)}
              autoFocus
              type="text"
            >
              <option disabled={true} value="">
                --RUKOVODILAC--
              </option>
              {emplList.length
                ? emplList.map((man, index) => (
                    <option key={index} value={man.ime}>
                      {man.ime}
                    </option>
                  ))
                : null}
            </select>
          ) : null}
        </span>
        <h4>Izvrsilac 1: </h4>
        <span>
          {emplList ? (
            <select
              style={{
                fontSize: "large",
                marginBottom: "5px",
                height: "2rem",
                width: "100%",
              }}
              onFocus={(e) => {
                e.target.selectedIndex = 0;
              }}
              onChange={(e) => izvrsilac1(e.target.value)}
              autoFocus
              type="text"
            >
              <option disabled={true} value="">
                --IZVRSILAC 1--
              </option>
              {emplList.length
                ? emplList.map((man, index) => (
                    <option key={index} value={man.ime}>
                      {man.ime}
                    </option>
                  ))
                : null}
            </select>
          ) : null}
        </span>
        <h4>Izvrsilac 2: </h4>
        <span>
          {" "}
          {emplList ? (
            <select
              style={{
                fontSize: "large",
                marginBottom: "5px",
                height: "2rem",
                width: "100%",
              }}
              onFocus={(e) => {
                e.target.selectedIndex = 0;
              }}
              onChange={(e) => izvrsilac2(e.target.value)}
              autoFocus
              type="text"
            >
              <option disabled={true} value="">
                --IZVRSILAC 2--
              </option>
              {emplList.length
                ? emplList.map((man, index) => (
                    <option key={index} value={man.ime}>
                      {man.ime}
                    </option>
                  ))
                : null}
            </select>
          ) : null}
        </span>
        <h4>Datum ispitivanja:</h4>
        <span>
          <input
            style={{
              fontSize: "large",
              marginBottom: "5px",
              height: "2rem",
              width: "100%",
            }}
            type="date"
            ref={datumIsp}
          ></input>
        </span>
      </div>
      <button
        className="block-btn"
        style={{ marginLeft: "0", width: "375px" }}
        onClick={handleNalog}
      >
        Upisi u bazu!
      </button>
    </div>
  );
};

export default Nalog;
