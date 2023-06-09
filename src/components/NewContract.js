import React from "react";
import { useRef, useContext } from "react";
import ReportContext from "../Context";
import serbianTransliteration from "serbian-transliteration";

const NewContract = () => {
  const { sviUgovori, setMessage } = useContext(ReportContext);
  const sifraCon = useRef();
  const brKorRef = useRef();
  const opisRef = useRef();
  const dateRef = useRef();

  const handleNew = async (e) => {
    e.preventDefault();
    let newCon = {
      sifra: sifraCon.current.value.toUpperCase().trim(),
      brojUg: brKorRef.current.value.trim(),
      opis: serbianTransliteration.toCyrillic(opisRef.current.value),
      datum: dateRef.current.value,
    };
    if (
      sviUgovori.filter((u) => {
        return u.oznaka === newCon.sifra;
      }).length
    ) {
      setMessage("Vec postoji ta sifra ugovora!");
      return;
    }
    if (newCon.sifra && newCon.brojUg && newCon.opis && newCon.datum) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/novi_ugovor`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCon),
          }
        );
        if (response.status === 210) {
          setMessage("primljeno");
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
    <>
      <div style={{ textAlign: "left" }}>
        <table style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <thead>
            <tr>
              <th>r.br</th>
              <th>Sifra ugovora</th>
              <th>Broj ugovora</th>
              <th>Opis ugovora</th>
              <th>Datum ugovora</th>
            </tr>
          </thead>
          <tbody>
            {sviUgovori?.map((ug, indU) => {
              return (
                <tr key={indU}>
                  <td>{indU + 1}</td>
                  <td>{ug.oznaka}</td>
                  <td>{ug.broj_ugovora_korisnik}</td>
                  <td>{ug.opis_ugovora}</td>
                  <td>{ug.datum_ugovora}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleNew}>
        <h3>Novi ugovor</h3>
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
          <h3>Oznaka Ugovora</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
              textTransform: "uppercase",
            }}
            ref={sifraCon}
          ></input>
          <h3>Broj ugovora korisnik</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={brKorRef}
          ></input>
          <h3>Opis Ugovora</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={opisRef}
          ></input>
          <h3>Datum ugovora</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={dateRef}
          ></input>
        </div>
        <button type="submit" style={{ marginLeft: "0" }} className="block-btn">
          Upisi u bazu
        </button>
      </form>
    </>
  );
};

export default NewContract;
