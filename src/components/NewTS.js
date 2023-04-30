import React, { useState } from "react";
import { useRef, useContext } from "react";
import ReportContext from "../Context";
import serbianTransliteration from "serbian-transliteration";

const NewTS = () => {
  const { trafoStanica, tsList } = useContext(ReportContext);
  const sifraRef = useRef();
  const nazivRef = useRef();
  const naponRef = useRef();
  const edRef = useRef();
  const regionRef = useRef();
  const objekatRef = useRef();
  const koordRef = useRef();
  const btnRef = useRef();
  const [novaTS, setNovaTS] = useState(false);

  const clearFields = () => {
    setNovaTS((prev) => !prev);
  };
  const handleNewTS = async () => {
    let newTS = {
      sifra: sifraRef.current.value.toUpperCase(),
      naziv: serbianTransliteration.toCyrillic(nazivRef.current.value),
      napon: naponRef.current.value.trim(),
      ed: edRef.current.value,
      region: regionRef.current.value,
      objekat: serbianTransliteration.toCyrillic(objekatRef.current.value),
      koordinate: koordRef.current.value,
    };
    // if (
    //   tsList.filter((t) => {
    //     return t.sifra_ts === newTS.sifra;
    //   }).length
    // )
    //  alert("Vec postoji ta sifra TS!");
    if (newTS.sifra && newTS.naziv && newTS.napon) {
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
          alert("primljeno");
          window.location.reload();
        } else {
          alert("Vec postoji ta sifra trafostanice ili greska servera...");
          return;
        }
      } catch (error) {
        alert("Greska na serveru");
      }
    }
  };
  return (
    <div style={{ width: "21cm", display: "block" }}>
      {trafoStanica ? (
        <>
          <div
            style={{
              display: "grid",
              width: "19cm",
              gridTemplateColumns: "9cm 10cm",
              textAlign: "left",
              margin: "auto",
              marginTop: "20px",
              rowGap: "10px",
              marginBottom: "20px",
            }}
          >
            <h3>Sifra trafostanice</h3>
            <input
              defaultValue={!novaTS ? trafoStanica?.sifra_ts : ""}
              style={{
                fontFamily: "Arial",
                fontSize: "1.2rem",
                fontWeight: "400",
                textTransform: "uppercase",
              }}
              ref={sifraRef}
            ></input>
            <h3>Naziv trafostanice</h3>
            <input
              defaultValue={!novaTS ? trafoStanica?.naziv : ""}
              style={{
                fontFamily: "Arial",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
              ref={nazivRef}
            ></input>
            <h3>Naponski nivo</h3>
            <input
              defaultValue={!novaTS ? trafoStanica?.naponski_nivo : ""}
              style={{
                fontFamily: "Arial",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
              ref={naponRef}
            ></input>
            <h3>ElektroDistribucija</h3>
            <input
              defaultValue={!novaTS ? trafoStanica?.ed : ""}
              style={{
                fontFamily: "Arial",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
              ref={edRef}
            ></input>
            <h3>Region</h3>
            <input
              defaultValue={!novaTS ? trafoStanica?.region : ""}
              style={{
                fontFamily: "Arial",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
              ref={regionRef}
            ></input>
            <h3>Objekat</h3>
            <input
              defaultValue={!novaTS ? "TS" : ""}
              style={{
                fontFamily: "Arial",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
              ref={objekatRef}
            ></input>
            <h3>Koordinate</h3>
            <input
              defaultValue={!novaTS ? trafoStanica?.koordinate : ""}
              style={{
                fontFamily: "Arial",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
              ref={koordRef}
            ></input>
          </div>
          <button ref={btnRef} onClick={() => clearFields()}>
            {!novaTS ? "Nova TS" : "Odustani"}
          </button>
          <button disabled={!novaTS && tsList} onClick={() => handleNewTS()}>
            Upisi u bazu
          </button>
        </>
      ) : null}
    </div>
  );
};

export default NewTS;
