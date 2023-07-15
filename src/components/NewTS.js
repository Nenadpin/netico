import React from "react";
import { useRef, useContext } from "react";
import serbianTransliteration from "serbian-transliteration";
import ReportContext from "../Context";

const NewTS = ({ tsList, setTsList }) => {
  const { setMessage, keepWorking } = useContext(ReportContext);
  const sifraRef = useRef();
  const nazivRef = useRef();
  const naponRef = useRef();
  const edRef = useRef();
  const regionRef = useRef();
  const objekatRef = useRef();
  const koordRef = useRef();

  const handleNewTS = async (e) => {
    e.preventDefault();
    let newTS = {
      sifra_ts: sifraRef.current.value.toUpperCase().trim(),
      naziv: serbianTransliteration.toCyrillic(nazivRef.current.value),
      naponski_nivo: naponRef.current.value.trim(),
      ed: edRef.current.value,
      region: regionRef.current.value,
      objekat: serbianTransliteration.toCyrillic(objekatRef.current.value),
      koordinate: koordRef.current.value,
    };
    if (
      tsList.filter((t) => {
        return t.sifra_ts === newTS.sifra_ts;
      }).length
    ) {
      setMessage("Vec postoji ta sifra TS!");
      return;
    }
    if (newTS.sifra_ts && newTS.naziv && newTS.naponski_nivo) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/nova_ts`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTS),
          }
        );
        if (response.status === 210) {
          setMessage("primljeno");
          console.log(newTS);
          let newList = [...tsList, newTS];
          setTsList(newList);
          setTimeout(() => keepWorking(), 2000);
        } else {
          setMessage("Greska servera...");
          return;
        }
      } catch (error) {
        setMessage("Greska na serveru");
      }
    } else setMessage("Morate popuniti obavezna polja!");
  };
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <form onSubmit={handleNewTS} style={{ marginTop: "0", width: "50%" }}>
        <h3>Nova trafostanica</h3>
        <div
          style={{
            display: "grid",
            width: "600px",
            gridTemplateColumns: "200px 320px",
            textAlign: "left",
            margin: "auto",
            marginTop: "20px",
            rowGap: "10px",
            marginBottom: "20px",
          }}
        >
          <h3>Sifra trafostanice (*)</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
              textTransform: "uppercase",
            }}
            ref={sifraRef}
            defaultValue={`TS${tsList.length + 1}`}
          ></input>
          <h3>Naziv trafostanice (*)</h3>
          <input
            autoFocus
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={nazivRef}
          ></input>
          <h3>Naponski nivo (*)</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            placeholder="naponi odvojeni znakom /"
            ref={naponRef}
          ></input>
          <h3>ElektroDistribucija</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={edRef}
          ></input>
          <h3>Region</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={regionRef}
          ></input>
          <h3>Objekat</h3>
          <input
            defaultValue={"TS"}
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={objekatRef}
          ></input>
          <h3>Koordinate</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={koordRef}
          ></input>
        </div>
        <button type="submit" style={{ marginLeft: "0" }} className="block-btn">
          Upisi u bazu
        </button>
      </form>
      <div style={{ maxHeight: "100vh", overflow: "scroll", width: "50%" }}>
        <table style={{ maxWidth: "600px", margin: "0 auto" }}>
          <thead>
            <tr>
              <th>r.br</th>
              <th>SifraTS</th>
              <th>Naziv TS</th>
              <th>Napon</th>
            </tr>
          </thead>
          <tbody>
            {tsList?.map((ts, ind) => {
              return (
                <tr key={ind}>
                  <td>{ind + 1}</td>
                  <td>{ts.sifra_ts}</td>
                  <td style={{ paddingLeft: "5px", textAlign: "left" }}>
                    {ts.naziv}
                  </td>
                  <td>{ts.naponski_nivo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewTS;
