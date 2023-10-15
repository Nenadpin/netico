import React from "react";
import { useRef, useContext } from "react";
import ReportContext from "../Context";
import serbianTransliteration from "serbian-transliteration";

const NewContract = () => {
  const { role, sviUgovori, setMessage, keepWorking, kd, setKd } =
    useContext(ReportContext);
  const sifraCon = useRef();
  const brKorRef = useRef();
  const opisRef = useRef();
  const dateRef = useRef();
  const brRef = useRef();
  const stavkaRef = useRef();
  const cenaRef = useRef();

  const handleNew = async (e) => {
    e.preventDefault();
    let newCon = {
      sifra: sifraCon.current.value.toUpperCase().trim(),
      brojUg: brKorRef.current.value.trim(),
      opis: serbianTransliteration.toCyrillic(opisRef.current.value),
      datum: dateRef.current.value,
      kd: kd,
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
        const token = sessionStorage.getItem(role);
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/novi_ugovor`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            body: JSON.stringify(newCon),
          }
        );
        if (response.status === 210) {
          setMessage("primljeno");
          setTimeout(() => keepWorking(), 2000);
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
  const handleDelete = (u) => {
    let newKd = kd.filter((k) => k.r_br !== kd[u].r_br);
    setKd(newKd);
  };
  const handleAdd = () => {
    let temp = [...kd];
    if (temp.filter((s) => s.r_br === parseInt(brRef.current.value)).length) {
      setMessage("Vec postoji taj redni broj stavke KD");
    } else {
      temp = [
        ...temp,
        {
          r_br: parseInt(brRef.current.value),
          opis_usluge: serbianTransliteration.toCyrillic(
            stavkaRef.current.value
          ),
          jed_cena: parseInt(cenaRef.current.value),
        },
      ];
      setKd(temp);
      brRef.current.value = "";
      stavkaRef.current.value = "";
      cenaRef.current.value = "";
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          maxWidth: "1120px",
          margin: "0 auto",
        }}
      >
        <form
          onSubmit={handleNew}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 0.5rem",
            marginLeft: "0",
            maxWidth: "500px",
            display: "inline-block",
          }}
        >
          <h3>Novi ugovor</h3>
          <div
            style={{
              display: "grid",
              width: "480px",
              gridTemplateColumns: "200px 280px",
              textAlign: "left",
              margin: "auto",
              marginTop: "20px",
              rowGap: "10px",
              marginBottom: "20px",
            }}
          >
            <h3>Šifra Ugovora</h3>
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
          <button
            type="submit"
            style={{ marginLeft: "0" }}
            className="block-btn"
          >
            Upisi u bazu
          </button>
        </form>
        <div
          style={{
            maxWidth: "800px",

            marginTop: "1.5rem",

            background: "white",
            display: "inline-block",
          }}
        >
          <h3>Konkursna dokumentacija:</h3>
          <div style={{ display: "flex" }}>
            <input
              style={{
                height: "1.5rem",
                width: "5%",
                fontSize: "1rem",
                padding: "0 0.175rem",
              }}
              placeholder="br."
              ref={brRef}
            ></input>
            <input
              style={{
                height: "1.5rem",
                width: "80%",
                fontSize: "1rem",
                padding: "0 0.175rem",
              }}
              placeholder="Opis usluge..."
              ref={stavkaRef}
            ></input>
            <input
              style={{
                height: "1.5rem",
                width: "10%",
                fontSize: "1rem",
                padding: "0 0.175rem",
              }}
              placeholder="Cena..."
              ref={cenaRef}
            ></input>
            <button
              style={{
                width: "5%",
                margin: "0",
                height: "1.5rem",
                padding: "0",
              }}
              onClick={() => {
                if (
                  brRef.current.value &&
                  stavkaRef.current.value &&
                  cenaRef.current.value
                )
                  handleAdd();
              }}
            >
              ok
            </button>
          </div>
          <div
            style={{
              maxWidth: "800px",
              maxHeight: "70vh",
              overflow: "auto",
              background: "white",
              display: "inline-block",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>r.br</th>
                  <th>Opis usluge</th>
                  <th>Cena</th>
                  <th>Obriši</th>
                </tr>
              </thead>
              <tbody>
                {kd
                  ?.sort((x, y) => x.r_br - y.r_br)
                  .map((k, ind) => {
                    return (
                      <tr key={ind} onClick={() => console.log(ind)}>
                        <td style={{ padding: "5px" }}>{k.r_br}</td>
                        <td style={{ textAlign: "left", padding: "5px" }}>
                          {k.opis_usluge}
                        </td>
                        <td style={{ padding: "5px" }}>{k.jed_cena}</td>
                        <td
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            fontSize: "large",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Sigurni ste da brisemo ovu uslugu?`
                              )
                            )
                              handleDelete(ind);
                          }}
                        >
                          X
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewContract;
