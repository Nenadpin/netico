import React from "react";
import { useRef, useContext } from "react";
import serbianTransliteration from "serbian-transliteration";
import ReportContext from "../Context";

const NewTS = ({ tsList }) => {
  const { setMessage, logout } = useContext(ReportContext);
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
      sifra: sifraRef.current.value.toUpperCase().trim(),
      naziv: serbianTransliteration.toCyrillic(nazivRef.current.value),
      napon: naponRef.current.value.trim(),
      ed: edRef.current.value,
      region: regionRef.current.value,
      objekat: serbianTransliteration.toCyrillic(objekatRef.current.value),
      koordinate: koordRef.current.value,
    };
    if (
      tsList.filter((t) => {
        return t.sifra_ts === newTS.sifra;
      }).length
    ) {
      setMessage("Vec postoji ta sifra TS!");
      return;
    }
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
          setMessage("primljeno");
          setTimeout(() => logout(), 2000);
        } else {
          setMessage("Greska servera...");
          return;
        }
      } catch (error) {
        setMessage("Greska na serveru");
      }
    }
  };
  return (
    <form onSubmit={handleNewTS}>
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
        <h3>Sifra trafostanice</h3>
        <input
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
          style={{
            fontFamily: "Arial",
            fontSize: "1.2rem",
            fontWeight: "400",
          }}
          ref={nazivRef}
        ></input>
        <h3>Naponski nivo</h3>
        <input
          style={{
            fontFamily: "Arial",
            fontSize: "1.2rem",
            fontWeight: "400",
          }}
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
  );
};

export default NewTS;
