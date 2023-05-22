import React, { useRef, useState } from "react";
import { useContext } from "react";
import ReportContext from "../Context";

const Nalog = () => {
  const sifraIsp = useRef();
  const datumIsp = useRef();

  const [tim, setTim] = useState({ r: "", i1: "", i2: "" });
  const { trafoStanica, narudzbenica, emplList, ispList } =
    useContext(ReportContext);

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
    if (!datumIsp.current.value) datumIsp.current.value = "";
    if (tim.r && tim.i1 && sifraIsp) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/nalog`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([
              narudzbenica.broj_narudzbenice,
              parseInt(sifraIsp.current.value),
              tim.r,
              tim.i1,
              tim.i2,
              datumIsp.current.value,
            ]),
          }
        );
        if (response.status === 210) {
          alert("primljeno");
          window.location.reload();
        } else {
          alert("neka greska...");
          return;
        }
      } catch (error) {
        alert("greska na serveru");
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
        Na osnovu narudzbenice br: {narudzbenica.broj_narudzbenice} izdaje se
        nalog za izradu zapisnika u trafostanici{" "}
        {trafoStanica.naponski_nivo.trim()} kV {trafoStanica.naziv}
      </h4>
      <br />
      <div className="nalog">
        <h4>Broj ispitivanja:</h4>
        <span>
          <input
            type="text"
            ref={sifraIsp}
            defaultValue={ispList.length + 1}
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
        <h4>Datum:</h4>
        <span>
          <input
            style={{
              fontSize: "large",
              marginBottom: "5px",
              height: "2rem",
              width: "100%",
            }}
            type="text"
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
