import React, { useContext, useMemo, useState } from "react";
import { useRef } from "react";
import serbianTransliteration from "serbian-transliteration";
import ReportContext from "../Context";
import Spinner from "./Spinner";

const Zapisnik = () => {
  let dataNar = {
    MT110: 0,
    PI110: 0,
    MT35ci: 0,
    MT35ul: 0,
    KZ35ci: 0,
    KZ35ul: 0,
    KS35: 0,
    PI35: 0,
    MT2010ci: 0,
    MT2010ul: 0,
    KZ2010ci: 0,
    KZ2010ul: 0,
    KS2010: 0,
    PI2010: 0,
  };
  const tipIzvoda = ["водно", "трафо", "мерно", "спојна", "резерва"];
  const { trafoStanica, narudzbenica, polja } = useContext(ReportContext);
  const oznakaPolja = useRef();
  const nazivPolja = useRef();
  const smtciPolja = useRef();
  const smtulPolja = useRef();
  const nmtciPolja = useRef();
  const nmtulPolja = useRef();
  const kzciPolja = useRef();
  const kzulPolja = useRef();
  const izPolja = useRef();
  const tempRef = useRef();
  const napomenaPolja = useRef([]);
  const spratPolja = useRef([]);
  const fazaPolja = useRef([]);
  const pozPolja = useRef([]);

  const [naruceno, setNaruceno] = useState(null);
  const [totalEl, setTotalEl] = useState(0);
  const [elNapon, setElNapon] = useState(-1);
  const [tipPolja, setTipPolja] = useState(0);
  const [zapisnikDetails, setZapisnikDetails] = useState([]);
  const [ukl, setUkl] = useState("");
  const [elpn, setElpn] = useState(null);
  const [modal, setModal] = useState(false);
  const [chEl, setChEl] = useState(null);
  const [loadData, setLoadData] = useState(false);

  useMemo(() => {
    if (narudzbenica !== null) {
      setTotalEl(0);
      setLoadData(true);
      for (let s = 0; s < narudzbenica.stavke.length; s++) {
        if (narudzbenica.stavke[s].pos === 5) {
          dataNar.MT110 += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 14) {
          dataNar.PI110 += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 3) {
          dataNar.MT35ci += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 4) {
          dataNar.MT35ul += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 8) {
          dataNar.KZ35ci += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 9) {
          dataNar.KZ35ul += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 11) {
          dataNar.KS35 += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 13) {
          dataNar.PI35 += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 1) {
          dataNar.MT2010ci += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 2) {
          dataNar.MT2010ul += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 6) {
          dataNar.KZ2010ci += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 7) {
          dataNar.KZ2010ul += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 10) {
          dataNar.KS2010 += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        } else if (narudzbenica.stavke[s].pos === 12) {
          dataNar.PI2010 += parseInt(narudzbenica.stavke[s].kol);
          setTotalEl((prev) => prev + parseInt(narudzbenica.stavke[s].kol));
        }
      }
      setNaruceno(dataNar);
    }
    if (localStorage.getItem("zapisnik")) {
      setTotalEl(parseInt(JSON.parse(localStorage.getItem("total"))));
      setZapisnikDetails(JSON.parse(localStorage.getItem("zapisnik")));
    }
    setLoadData(false);
  }, [narudzbenica]);

  useMemo(() => {
    if (elNapon > -1) {
      if (trafoStanica.napon[elNapon] === "110") {
        smtulPolja.current.disabled = true;
        nmtulPolja.current.disabled = true;
        kzciPolja.current.disabled = true;
        kzulPolja.current.disabled = true;
      } else {
        smtulPolja.current.disabled = false;
        nmtulPolja.current.disabled = false;
        kzciPolja.current.disabled = false;
        kzulPolja.current.disabled = false;
      }
    }
  }, [elNapon]);

  const uklopnoStanje = () => {
    if (ukl === "") {
      setUkl("без напона");
    } else {
      setUkl("");
    }
  };
  function parseEl(x, y) {
    let elArr = [];
    for (let i = 0; i < x - (x % 3); i += 3) {
      elArr[i] = {
        faza: "0",
        opis:
          Math.floor(i / 3) === 0 ? "X" : (Math.floor(i / 3) + y).toString(),
        sprat: "",
      };
      elArr[i + 1] = {
        faza: "4",
        opis:
          Math.floor(i / 3) === 0 ? "X" : (Math.floor(i / 3) + y).toString(),
        sprat: "",
      };
      elArr[i + 2] = {
        faza: "8",
        opis:
          Math.floor(i / 3) === 0 ? "X" : (Math.floor(i / 3) + y).toString(),
        sprat: "",
      };
    }
    for (let i = x - (x % 3), j = Math.floor(i / 3); i < x; i++, j++) {
      elArr[i] = {
        faza: "4",
        opis: i === 0 ? "X" : j.toString(),
        sprat: "",
      };
    }
    return elArr;
  }

  const handleItem = () => {
    if (oznakaPolja.current.value && elNapon > -1 && tipPolja) {
      let tempPolje = {
        ozn: oznakaPolja.current.value.toUpperCase(),
        napkV: trafoStanica.napon[elNapon].trim(),
        tip: tipPolja,
        izvod: serbianTransliteration
          .toCyrillic(nazivPolja.current.value)
          .replaceAll("кВ", "kV"),
        sci: smtciPolja.current.value,
        sul: smtulPolja.current.value,
        nci: nmtciPolja.current.value,
        nul: nmtulPolja.current.value,
        kci: kzciPolja.current.value,
        kul: kzulPolja.current.value,
        pi: izPolja.current.value,
        us: ukl,
        elementi: [],
      };

      let diff = 0;
      if (parseInt(tempPolje.sci)) {
        let no = parseEl(parseInt(tempPolje.sci), 0);
        for (let i = 0; i < no.length; i++) {
          tempPolje.elementi.push({
            oznaka: "СМТ",
            faza: no[i].faza,
            opis: no[i].opis,
            sprat: no[i].sprat,
            tipEl: "са чврстом изолацијом",
          });
        }
        diff += parseInt(tempPolje.sci);
      }
      if (parseInt(tempPolje.sul)) {
        let no = parseEl(
          parseInt(tempPolje.sul),
          parseInt(tempPolje.sci)
            ? Math.floor(parseInt(tempPolje.sci) / 3) + 1
            : 0
        );
        for (let i = 0; i < no.length; i++) {
          tempPolje.elementi.push({
            oznaka: "СМТ",
            faza: no[i].faza,
            opis: no[i].opis,
            sprat: no[i].sprat,
            tipEl: "са уљном изолацијом",
          });
        }
        diff += parseInt(tempPolje.sul);
      }
      if (parseInt(tempPolje.nci)) {
        let no = parseEl(parseInt(tempPolje.nci), 0);
        for (let i = 0; i < no.length; i++) {
          tempPolje.elementi.push({
            oznaka: "НМТ",
            faza: no[i].faza,
            opis: no[i].opis,
            sprat: no[i].sprat,
            tipEl: "са чврстом изолацијом",
          });
        }
        diff += parseInt(tempPolje.nci);
      }
      if (parseInt(tempPolje.nul)) {
        let no = parseEl(
          parseInt(tempPolje.sul),
          parseInt(tempPolje.nci)
            ? Math.floor(parseInt(tempPolje.nci) / 3) + 1
            : 0
        );
        for (let i = 0; i < no.length; i++) {
          tempPolje.elementi.push({
            oznaka: "НМТ",
            faza: no[i].faza,
            opis: no[i].opis,
            sprat: no[i].sprat,
            tipEl: "са уљном изолацијом",
          });
        }
        diff += parseInt(tempPolje.nul);
      }
      if (parseInt(tempPolje.kci)) {
        let no = parseEl(parseInt(tempPolje.kci), 0);
        for (let i = 0; i < no.length; i++) {
          tempPolje.elementi.push({
            oznaka: "КЗ",
            faza: no[i].faza,
            opis: no[i].opis,
            sprat: no[i].sprat,
            tipEl: "са чврстом изолацијом",
          });
        }
        diff += parseInt(tempPolje.kci);
      }
      if (parseInt(tempPolje.kul)) {
        let no = parseEl(
          parseInt(tempPolje.kul),
          parseInt(tempPolje.kci)
            ? Math.floor(parseInt(tempPolje.kci) / 3) + 1
            : 0
        );
        for (let i = 0; i < no.length; i++) {
          tempPolje.elementi.push({
            oznaka: "КЗ",
            faza: no[i].faza,
            opis: no[i].opis,
            sprat: no[i].sprat,
            tipEl: "са уљном изолацијом",
          });
        }
        diff += parseInt(tempPolje.kul);
      }
      if (parseInt(tempPolje.pi)) {
        let no = parseEl(parseInt(tempPolje.pi), 0);
        for (let i = 0; i < no.length; i++) {
          tempPolje.elementi.push({
            oznaka: "ПИ",
            faza: no[i].faza,
            opis: no[i].opis,
            sprat: no[i].sprat,
            tipEl: "",
          });
        }
        diff += parseInt(tempPolje.pi);
      }
      if (tempPolje.us === "") setTotalEl((prev) => prev - diff);
      setZapisnikDetails((zapisnikDetails) => [...zapisnikDetails, tempPolje]);
      setTipPolja(0);
      setUkl("");
      oznakaPolja.current.value = "";
      nazivPolja.current.value = "";
      smtciPolja.current.value = "";
      smtulPolja.current.value = "";
      nmtciPolja.current.value = "";
      nmtulPolja.current.value = "";
      kzciPolja.current.value = "";
      kzulPolja.current.value = "";
      izPolja.current.value = "";
      setElpn(tempPolje);
      setChEl(zapisnikDetails.length);
      setModal(true);
    } else alert("Morate uneti Oznaku polja, napon i tip polja...");
    return;
  };

  const handleFieldDetails = (x) => {
    let temp = zapisnikDetails;
    let ctrl = new Set();
    for (let i = 0; i < temp[x].elementi.length; i++) {
      temp[x].elementi[i].sprat = spratPolja.current[i].checked;
      temp[x].elementi[i].napomena = napomenaPolja.current[i].value;
      temp[x].elementi[i].faza = fazaPolja.current[i].value.toUpperCase();
      temp[x].elementi[i].opis = pozPolja.current[i].value.toUpperCase();
      ctrl.add(
        `${temp[x].elementi[i].oznaka}${temp[x].elementi[i].faza}${temp[x].elementi[i].opis}`
      );
    }
    if (ctrl.size !== temp[x].elementi.length) {
      alert("Ne mogu biti vise elemenata na istoj fazi i poziciji!");
      return;
    }
    setZapisnikDetails(temp);
    for (let i = 0; i < temp[x].elementi.length; i++) {
      napomenaPolja.current[i].value = "";
      spratPolja.current[i].checked = false;
    }
    setElpn(null);
    setModal(false);
    localStorage.setItem("zapisnik", JSON.stringify(zapisnikDetails));
    localStorage.setItem("total", totalEl);
  };
  const handleDeleteZapisnik = (item) => {
    setZapisnikDetails(
      zapisnikDetails.filter((x) => {
        return zapisnikDetails.indexOf(x) !== parseInt(item);
      })
    );
    let diff = 0;
    if (parseInt(zapisnikDetails[item].sci))
      diff += parseInt(zapisnikDetails[item].sci);
    if (parseInt(zapisnikDetails[item].sul))
      diff += parseInt(zapisnikDetails[item].sul);
    if (parseInt(zapisnikDetails[item].nci))
      diff += parseInt(zapisnikDetails[item].nci);
    if (parseInt(zapisnikDetails[item].nul))
      diff += parseInt(zapisnikDetails[item].nul);
    if (parseInt(zapisnikDetails[item].kci))
      diff += parseInt(zapisnikDetails[item].kci);
    if (parseInt(zapisnikDetails[item].kul))
      diff += parseInt(zapisnikDetails[item].kul);
    if (parseInt(zapisnikDetails[item].pi))
      diff += parseInt(zapisnikDetails[item].pi);
    if (zapisnikDetails[item].us === "") setTotalEl((prev) => prev + diff);
  };

  const submitZapisnik = async () => {
    const dataZap = {
      ts: trafoStanica.sifra_ts,
      nar: narudzbenica.broj_narudzbenice,
      zap: zapisnikDetails,
      temp: tempRef.current.value,
    };
    setLoadData(true);
    try {
      const response2 = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/zapisnik`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataZap),
        }
      );
      if (response2.status === 210) {
        alert("primljeno");
        setZapisnikDetails(null);
        setLoadData(false);
        //localStorage.removeItem("zapisnik");
        //localStorage.removeItem("total");
        window.location.reload();
      } else {
        alert("neka greska...");
        setLoadData(false);
        return;
      }
    } catch (error) {
      alert("Greska na serveru");
      setLoadData(false);
    }
  };
  const handleDetails = (id) => {
    // for (let i = 0; i < zapisnikDetails[id].elementi.length; i++) {
    //   spratPolja.current[i].checked = zapisnikDetails[id].elementi[i].sprat;
    //   napomenaPolja.current[i].value = zapisnikDetails[id].elementi[i].napomena
    //     ? zapisnikDetails[id].elementi[i].napomena
    //     : "";
    // }
    setElpn(() => zapisnikDetails[id]);
    setChEl(id);
    setModal(true);
  };

  return (
    <div className="zapisnik">
      {loadData && <Spinner />}
      {naruceno ? (
        <>
          <div className="zapisnikEl">
            <span>Oznaka polja</span>
            <span>Napon</span>
            <span>Tip polja</span>
            <span>Naziv izvoda/celije</span>
            <span>SMT</span>
            <span>NMT</span>
            <span>KZ</span>
            <span>IZ</span>
            <span>Uklopno Stanje</span>
            <span>
              <input
                placeholder="Ozn..."
                ref={oznakaPolja}
                style={{ textTransform: "uppercase" }}
                onBlur={() => {
                  let poljeZ = polja.filter(
                    (p) =>
                      p.celija_oznaka ===
                      oznakaPolja.current.value.toUpperCase()
                  );
                  if (poljeZ.length)
                    nazivPolja.current.value = poljeZ[0].celija_naziv;
                  else nazivPolja.current.value = "";
                }}
              ></input>
            </span>
            <span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "7px",
                }}
              >
                {trafoStanica.napon.length
                  ? trafoStanica.napon.map((n, idn) => {
                      return (
                        <div
                          key={idn}
                          style={{ display: "flex", justifyContent: "left" }}
                        >
                          <input
                            type="radio"
                            value={idn}
                            checked={elNapon === idn ? true : false}
                            onChange={() => setElNapon(idn)}
                          />
                          {n.trim()}kV
                        </div>
                      );
                    })
                  : null}
              </div>
            </span>
            <span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "left",
                }}
              >
                <span>
                  <input
                    type="radio"
                    value={tipPolja}
                    checked={tipPolja === 1 ? true : false}
                    onChange={() => setTipPolja(1)}
                  />{" "}
                  V
                </span>
                <span>
                  <input
                    type="radio"
                    value={tipPolja}
                    checked={tipPolja === 2 ? true : false}
                    onChange={() => setTipPolja(2)}
                  />{" "}
                  T
                </span>
                <span>
                  <input
                    type="radio"
                    value={tipPolja}
                    checked={tipPolja === 3 ? true : false}
                    onChange={() => setTipPolja(3)}
                  />{" "}
                  M
                </span>
                <span>
                  <input
                    type="radio"
                    value={tipPolja}
                    checked={tipPolja === 4 ? true : false}
                    onChange={() => setTipPolja(4)}
                  />{" "}
                  S
                </span>
                <span>
                  <input
                    type="radio"
                    value={tipPolja}
                    checked={tipPolja === 5 ? true : false}
                    onChange={() => setTipPolja(5)}
                  />{" "}
                  R
                </span>
              </div>
            </span>
            <span>
              <input placeholder="Naziv izvoda..." ref={nazivPolja}></input>
            </span>
            <span>
              <input placeholder="SMT či" ref={smtciPolja}></input>
              <input placeholder="SMT ul" ref={smtulPolja}></input>
            </span>
            <span>
              <input placeholder="NMT či" ref={nmtciPolja}></input>
              <input placeholder="NMT ul" ref={nmtulPolja}></input>
            </span>
            <span>
              <input placeholder="KZ či" ref={kzciPolja}></input>
              <input placeholder="KZ ul" ref={kzulPolja}></input>
            </span>
            <span>
              <input placeholder="IZ" ref={izPolja}></input>
            </span>
            <span>
              <input
                type="checkbox"
                style={{ width: "auto" }}
                value={ukl}
                checked={ukl === "без напона" ? true : false}
                onChange={uklopnoStanje}
              />{" "}
              X
              <button
                style={{
                  width: "3cm",
                  marginTop: "5px",
                  marginBottom: "5px",
                  marginLeft: "-2px",
                  color: "white",
                  fontWeight: "bold",
                  padding: "3px",
                  backgroundColor: "hsl(360, 67%, 44%)",
                }}
                onClick={() => handleItem()}
              >
                {`UPISI (${totalEl})`}
              </button>
              {totalEl <= 0 ? (
                <button
                  style={{
                    width: "3cm",
                    marginLeft: "-2px",
                    marginBottom: "5px",
                    padding: "3px",
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "hsl(125, 67%, 44%)",
                  }}
                  onClick={() => {
                    if (totalEl <= 0) submitZapisnik();
                  }}
                >
                  {`SNIMI`}
                </button>
              ) : null}
              <span>
                Temp <input ref={tempRef} style={{ width: "1cm" }}></input> °C
              </span>
            </span>
          </div>
          <div
            className="modal"
            onClick={() => {
              setElpn(null);
              setModal(false);
              localStorage.setItem("zapisnik", JSON.stringify(zapisnikDetails));
              localStorage.setItem("total", totalEl);
            }}
            style={{ display: modal ? "block" : "none" }}
          ></div>
          <div style={{ display: "flex", flexDirection: "row", width: "21cm" }}>
            <div className="zapisnikLeft">
              <span style={{ textAlign: "center" }}>
                <h3>
                  Записник о испитивању кабловских завршница и мерних
                  трансформатора
                </h3>
              </span>
              <div className="naruceno">
                <span style={{ width: "100px" }}>
                  <h4>Наручено испитивање:</h4>
                </span>
                {naruceno.MT110 + naruceno.PI110 !== 0 ? (
                  <div>
                    <h4>Напонски ниво 110kV</h4>
                    {naruceno.MT110 !== 0 ? (
                      <p>МТ 110kV {naruceno.MT110} ком</p>
                    ) : null}
                    {naruceno.PI110 !== 0 ? (
                      <p>PI 110kV {naruceno.PI110} ком</p>
                    ) : null}
                  </div>
                ) : null}
                {naruceno.MT35ci +
                  naruceno.MT35ul +
                  naruceno.KZ35ci +
                  naruceno.KZ35ul +
                  naruceno.KS35 +
                  naruceno.PI35 !==
                0 ? (
                  <div>
                    <h4>Напонски ниво 35kV</h4>
                    {naruceno.MT35ci !== 0 ? (
                      <p>МТ či 35kV {naruceno.MT35ci} ком</p>
                    ) : null}
                    {naruceno.MT35ul !== 0 ? (
                      <p>МТ ul 35kV {naruceno.MT35ul} ком</p>
                    ) : null}
                    {naruceno.KZ35ci !== 0 ? (
                      <p>KZ či 35kV {naruceno.KZ35ci} ком</p>
                    ) : null}
                    {naruceno.KZ35ul !== 0 ? (
                      <p>KZ ul 35kV {naruceno.KZ35ul} ком</p>
                    ) : null}
                    {naruceno.KS35 !== 0 ? (
                      <p>KS 35kV {naruceno.KS35} ком</p>
                    ) : null}
                    {naruceno.PI35 !== 0 ? (
                      <p>PI 35kV {naruceno.PI35} ком</p>
                    ) : null}
                  </div>
                ) : null}
                {naruceno.MT2010ci +
                  naruceno.MT2010ul +
                  naruceno.KZ2010ci +
                  naruceno.KZ2010ul +
                  naruceno.KS2010 +
                  naruceno.PI2010 !==
                0 ? (
                  <div>
                    <h4>Напонски ниво 20kV 10kV</h4>
                    {naruceno.MT2010ci !== 0 ? (
                      <p>МТ či 20kV 10kV {naruceno.MT2010ci} ком</p>
                    ) : null}
                    {naruceno.MT2010ul !== 0 ? (
                      <p>МТ ul 20kV 10kV {naruceno.MT2010ul} ком</p>
                    ) : null}
                    {naruceno.KZ2010ci !== 0 ? (
                      <p>KZ či 20kV 10kV {naruceno.KZ2010ci} ком</p>
                    ) : null}
                    {naruceno.KZ2010ul !== 0 ? (
                      <p>KZ ul 20kV 10kV {naruceno.KZ2010ul} ком</p>
                    ) : null}
                    {naruceno.KS2010 !== 0 ? (
                      <p>KS 20kV 10kV {naruceno.KS2010} ком</p>
                    ) : null}
                    {naruceno.PI2010 !== 0 ? (
                      <p>PI 20kV 10kV {naruceno.PI2010} ком</p>
                    ) : null}
                  </div>
                ) : null}
                <span style={{ width: "6cm" }}>
                  <h4>Напомена (Уклопно стање):</h4>
                </span>
              </div>
              <table className="tblZ">
                <colgroup>
                  <col span="1" style={{ width: "5%" }}></col>
                  <col span="1" style={{ width: "5%" }}></col>
                  <col span="1" style={{ width: "5%" }}></col>
                  <col span="1" style={{ width: "8%" }}></col>
                  <col span="1" style={{ width: "27%" }}></col>
                  <col span="1" style={{ width: "10%" }}></col>
                  <col span="1" style={{ width: "10%" }}></col>
                  <col span="1" style={{ width: "10%" }}></col>
                  <col span="1" style={{ width: "5%" }}></col>
                </colgroup>
                <tbody>
                  {zapisnikDetails?.length
                    ? zapisnikDetails.map((d, idz) => {
                        return (
                          <tr key={idz}>
                            <td>{idz + 1}</td>
                            <td
                              style={{
                                fontWeight: "bold",
                                cursor: "pointer",
                                color: "red",
                              }}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Sigurni ste da brisemo ovo polje?"
                                  )
                                )
                                  handleDeleteZapisnik(idz);
                              }}
                            >
                              {d?.ozn}
                            </td>
                            <td>{d?.napkV}</td>
                            <td>{tipIzvoda[d?.tip - 1]}</td>
                            <td
                              style={{
                                fontWeight: "bold",
                                cursor: "pointer",
                                color: "green",
                              }}
                              onClick={() => handleDetails(idz)}
                            >
                              {d?.izvod}
                            </td>
                            {d?.sci || d?.sul ? (
                              <td>
                                {d?.sci ? <strong>{d?.sci}či </strong> : null}
                                {d?.sul ? <strong>{d?.sul}ul</strong> : null}
                              </td>
                            ) : (
                              <td></td>
                            )}
                            {d?.nci || d?.nul ? (
                              <td>
                                {d?.nci ? <strong>{d?.nci}či </strong> : null}
                                {d?.nul ? <strong>{d?.nul}ul</strong> : null}
                              </td>
                            ) : (
                              <td></td>
                            )}
                            {d?.kci || d?.kul ? (
                              <td>
                                {d?.kci ? <strong>{d?.kci}či </strong> : null}
                                {d?.kul ? <strong>{d?.kul}ul</strong> : null}
                              </td>
                            ) : (
                              <td></td>
                            )}
                            {d?.pi ? (
                              <td>{d?.pi ? <strong>{d?.pi}</strong> : null}</td>
                            ) : (
                              <td></td>
                            )}
                            {d?.us ? (
                              <td>{d?.us ? `${d?.us}` : null}</td>
                            ) : (
                              <td></td>
                            )}
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
              {elpn ? (
                <div
                  style={{
                    display: modal ? "flex" : "none",
                    position: "absolute",
                    flexDirection: "column",
                    padding: "5px",
                    width: "9cm",
                    left: "6cm",
                    top: "7cm",
                    backgroundColor: "rgb(209,211,211)",
                    border: "2px solid black",
                    opacity: "1",
                    zIndex: "100",
                    borderRadius: "10px",
                  }}
                >
                  {elpn.ozn} -{elpn.napkV}kV
                  <table
                    className="tblZ"
                    style={{
                      border: "none",
                      width: "8.5cm",
                      marginTop: "none",
                    }}
                  >
                    <colgroup>
                      <col span="1" style={{ width: "1cm" }}></col>
                      <col span="1" style={{ width: "1cm" }}></col>
                      <col span="1" style={{ width: "1cm" }}></col>
                      <col span="1" style={{ width: "1cm" }}></col>
                      <col span="1" style={{ width: "4cm" }}></col>
                    </colgroup>
                    <thead style={{ paddingBottom: "10px", border: "none" }}>
                      <tr style={{ border: "none" }}>
                        <th style={{ border: "none" }}>Ozn</th>
                        <th style={{ border: "none" }}>Faza</th>
                        <th style={{ border: "none" }}>Poz</th>
                        <th style={{ border: "none" }}>Sprat</th>
                        <th style={{ border: "none" }}>Napomena</th>
                      </tr>
                    </thead>
                    <tbody style={{ border: "none" }}>
                      {elpn.elementi?.map((e, ide) => {
                        return (
                          <tr key={ide}>
                            <td>{e.oznaka}</td>
                            <td>
                              <input
                                style={{ fontSize: "1rem", width: "1cm" }}
                                type="text"
                                defaultValue={e.faza}
                                ref={(ref) => {
                                  if (ref) fazaPolja.current[ide] = ref;
                                }}
                              ></input>
                            </td>
                            <td>
                              <input
                                style={{
                                  fontSize: "1rem",
                                  width: "1cm",
                                }}
                                type="text"
                                defaultValue={e.opis}
                                ref={(ref) => {
                                  if (ref) pozPolja.current[ide] = ref;
                                }}
                              ></input>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                defaultChecked={e.sprat}
                                ref={(ref) => {
                                  if (ref) spratPolja.current[ide] = ref;
                                }}
                                style={{
                                  display: "block",
                                  textAlign: "center",
                                  margin: "auto",
                                }}
                              ></input>
                            </td>
                            <td>
                              <input
                                type="text"
                                placeholder="dodatni opis..."
                                style={{
                                  fontSize: "1rem",
                                  width: "4.5cm",
                                }}
                                ref={(ref) => {
                                  if (ref) napomenaPolja.current[ide] = ref;
                                }}
                              ></input>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "0.5cm",
                    }}
                  >
                    <button
                      className="block-btn"
                      style={{
                        width: "320px",
                        borderBottom: "none",
                        marginLeft: "0",
                      }}
                      onClick={() => {
                        handleFieldDetails(chEl);
                      }}
                    >
                      Promeni
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Zapisnik;
