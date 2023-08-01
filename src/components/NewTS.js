import React, { useMemo, useState } from "react";
import { useRef, useContext } from "react";
import Autosuggest from "react-autosuggest";
import serbianTransliteration from "serbian-transliteration";
import ReportContext from "../Context";

const NewTS = ({ tsList, setTsList }) => {
  const { role, setMessage, keepWorking } = useContext(ReportContext);
  const sifraRef = useRef();
  const nazivRef = useRef();
  const naponRef = useRef();
  const regionRef = useRef();
  const objekatRef = useRef();
  const koordRef = useRef();
  const [dispTS, setDispTS] = useState([]);
  const [opt, setOpt] = useState();
  const [value, setValue] = useState("");

  const handleChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const renderSuggestion = (suggestion) => {
    return <div>{suggestion}</div>;
  };
  const getSuggestions = (inputValue) => {
    if (opt) {
      const inputValueLower = inputValue.trim().toLowerCase();
      const inputLength = inputValueLower.length;
      const filteredSuggestions =
        inputLength === 0
          ? []
          : opt.filter(
              (word) =>
                word.toLowerCase().slice(0, inputLength) === inputValueLower
            );
      return filteredSuggestions.slice(0, 3); // Limiting to 3 suggestions
    }
    return [];
  };

  useMemo(() => {
    if (tsList) {
      const uniqueValues = new Set();
      let d = tsList;
      d.forEach((itemEd) => {
        uniqueValues.add(serbianTransliteration.toLatin(itemEd.ed));
      });
      setDispTS(d);
      setOpt([...uniqueValues]);
    }
  }, [tsList]);

  const handleNewTS = async (e) => {
    e.preventDefault();
    let newTS = {
      sifra_ts: sifraRef.current.value.toUpperCase().trim(),
      naziv: serbianTransliteration.toCyrillic(nazivRef.current.value),
      naponski_nivo: naponRef.current.value.trim(),
      ed: serbianTransliteration.toCyrillic(value),
      region: serbianTransliteration.toCyrillic(regionRef.current.value),
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
    if (newTS.sifra_ts && newTS.naziv && newTS.naponski_nivo && value) {
      try {
        const token = sessionStorage.getItem(role);
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/nova_ts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            body: JSON.stringify(newTS),
          }
        );
        if (response.status === 210) {
          setMessage("primljeno");
          console.log(newTS);
          let newList = [...tsList, newTS];
          setTsList(newList);
          sifraRef.current.value = "";
          nazivRef.current.value = "";
          naponRef.current.value = "";
          setValue("");
          regionRef.current.value = "";
          objekatRef.current.value = "TS";
          koordRef.current.value = "";
        } else {
          setMessage("Greska servera...");
          return;
        }
      } catch (error) {
        setMessage("Greska na serveru");
      }
    } else setMessage("Morate popuniti obavezna polja!");
  };

  const filterTS = (sifra) => {
    let newDisp = dispTS.filter(
      (t) => t.ed === serbianTransliteration.toCyrillic(sifra)
    );
    setDispTS(newDisp);
    sifraRef.current.value = `TS${(tsList.length + 1)
      .toString()
      .padStart(3, "0")}`;
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
            disabled
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
              textTransform: "uppercase",
            }}
            ref={sifraRef}
            defaultValue={`TS${(tsList.length + 104)
              .toString()
              .padStart(3, "0")}`}
          ></input>
          <h3>Naziv trafostanice (*)</h3>
          <input
            autoFocus
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            onFocus={() =>
              (sifraRef.current.value = `TS${(tsList.length + 104)
                .toString()
                .padStart(3, "0")}`)
            }
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
          <h3>ElektroDistribucija(*)</h3>
          <Autosuggest
            suggestions={getSuggestions(value)}
            onSuggestionsFetchRequested={() => {}}
            onSuggestionsClearRequested={() => {}}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: "Ukucajte ED",
              value,
              onChange: handleChange,
            }}
            style={{ width: "320px" }}
          />
          <h3>Region</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            onFocus={() => console.log(value)}
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
      {dispTS && opt ? (
        <div style={{ maxHeight: "100vh", overflow: "scroll", width: "50%" }}>
          <table style={{ maxWidth: "600px", margin: "0 auto" }}>
            <thead>
              <tr>
                <th>r.br</th>
                <th>SifraTS</th>
                <th>Naziv TS</th>
                <th>
                  <select
                    style={{
                      marginBottom: "0",
                      padding: "0",
                      fontSize: "0.8rem",
                      height: "1.5rem",
                    }}
                    onFocus={(e) => {
                      e.target.selectedIndex = 0;
                      setDispTS(tsList);
                    }}
                    autoFocus
                    type="text"
                    onChange={(e) => {
                      filterTS(e.target.value);
                      e.target.blur();
                    }}
                  >
                    <option disabled={true} value="">
                      El. Distribucija
                    </option>
                    {opt.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </th>
                <th>Napon</th>
              </tr>
            </thead>
            <tbody>
              {dispTS.map((ts, ind) => {
                return (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{ts.sifra_ts}</td>
                    <td style={{ paddingLeft: "5px", textAlign: "left" }}>
                      {ts.naziv}
                    </td>
                    <td style={{ paddingLeft: "5px", textAlign: "left" }}>
                      {ts.ed}
                    </td>
                    <td>{ts.naponski_nivo}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default NewTS;
