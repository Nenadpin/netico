import React, { useMemo, useRef, useState } from "react";
import serbianTransliteration from "serbian-transliteration";
import { useContext } from "react";
import ReportContext from "../Context";
import Spinner from "./Spinner";

const Order = ({ setFilter }) => {
  const {
    role,
    trafoStanica,
    narudzbenica,
    mesto,
    kd,
    sviUgovori,
    ugovor,
    orders,
    setOrders,
    setMesto,
    setUgovor,
    setMessage,
    logout,
    greska,
    keepWorking,
  } = useContext(ReportContext);
  const zavodniBr = useRef();
  const brNarudz = useRef();
  const brSap = useRef();
  const datumNar = useRef();
  const datumNar2 = useRef();
  const kolicina = useRef();
  const mestoRef = useRef();
  const kdRef = useRef();

  const [kdStavka, setKdStavka] = useState(0);
  const [orderDetails, setOrderDetails] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadData, setLoadData] = useState(false);

  useMemo(() => {
    if (narudzbenica) {
      setOrderDetails(narudzbenica.stavke);
      setTotal(narudzbenica.iznos / 1.2);
    }
  }, [narudzbenica]);

  const handleSubmit = () => {
    let oneItem = {
      pos: kd[kdStavka].r_br,
      opis: kd[kdStavka].opis_usluge,
      kol: kolicina.current.value,
      cena: kd[kdStavka].jed_cena,
    };
    setTotal((prev) => prev + oneItem.cena * oneItem.kol);
    setOrderDetails([...orderDetails, oneItem]);
    kolicina.current.value = "";
    kdRef.current.focus();
  };

  const deleteItem = (x) => {
    let tempDetails = orderDetails.filter((a) => {
      if (orderDetails.indexOf(a) === parseInt(x))
        setTotal((prev) => prev - a.kol * a.cena);
      return orderDetails.indexOf(a) !== parseInt(x);
    });
    setOrderDetails(tempDetails);
  };

  const handleOrder = async () => {
    if (
      orderDetails.length &&
      trafoStanica &&
      brNarudz.current.value &&
      brSap.current.value &&
      datumNar.current.value
    ) {
      try {
        setLoadData(true);
        const token = sessionStorage.getItem(role);
        const tempOrder = {
          broj_narudzbenice: brNarudz.current.value,
          sifra_ts: trafoStanica.sifra_ts,
          iznos: total * 1.2,
          operativno: "nova",
          datum: datumNar.current.value,
          sifra_ugovora: ugovor ? ugovor.oznaka : narudzbenica.sifra_ugovora,
          stavke: orderDetails,
          mesto: mesto,
          datum2: datumNar2.current.value,
          br_sap: brSap.current.value,
          zavodni_br: zavodniBr.current.value,
          naziv: trafoStanica.naziv,
        };
        const response2 = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/order`,
          {
            method: "POST",
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Object.values(tempOrder)),
          }
        );
        if (response2.status === 210) {
          setMessage("primljeno");
          setFilter(false);
          setTimeout(() => keepWorking(), 2000);
          setOrders([...orders, tempOrder]);
        } else {
          const errorData = await response2.json();
          setMessage(errorData.err.message);
          setLoadData(false);
          return;
        }
      } catch (error) {
        setMessage(error.message);
        setLoadData(false);
      }
    } else setMessage("Niste popunili sve podatke!");
  };
  const handleQuit = async () => {
    if (narudzbenica) {
      setLoadData(true);
      const token = sessionStorage.getItem(role);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/greska_nar`,
          {
            method: "PUT",
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(narudzbenica),
          }
        );
        if (response.status === 210) {
          setLoadData(false);
          setMessage("Ova narudzbenica vise nije aktivna");
          setTimeout(() => logout(), 3000);
          return;
        } else if (response.status === 501) {
          const errorData = await response.json();
          setMessage(errorData.error);
          setLoadData(false);
        }
      } catch (err) {
        setMessage(err.message);
        setLoadData(false);
      }
    }
  };

  return (
    <div className="order">
      <>
        {loadData ? <Spinner /> : null}
        <div className="orderInfo">
          <span style={{ marginTop: "7px" }}>
            <strong>Уговор: </strong>
          </span>
          <select
            onFocus={(e) => {
              e.target.selectedIndex = 0;
            }}
            autoFocus
            onChange={(e) => {
              let temUg = sviUgovori.filter((x) => {
                return x.oznaka === e.target.value;
              });
              setUgovor(temUg[0]);
            }}
            type="text"
          >
            {!narudzbenica ? (
              <option disabled={true} value="">
                --IZBOR UGOVORA--
              </option>
            ) : (
              <option disabled={true} value={narudzbenica.sifra_ugovora}>
                {
                  sviUgovori.filter((ug) => {
                    return ug.oznaka === narudzbenica.sifra_ugovora;
                  })[0].opis_ugovora
                }
              </option>
            )}
            {sviUgovori
              ? sviUgovori.map((ug, index) => (
                  <option key={index} value={ug.oznaka}>
                    {ug.opis_ugovora}
                  </option>
                ))
              : null}
          </select>
        </div>
        <div className="newOrderChoice">
          <span style={{ marginTop: "7px" }}>
            <strong>Услуга: </strong>
          </span>
          <select
            ref={kdRef}
            onFocus={(e) => {
              e.target.selectedIndex = 0;
            }}
            autoFocus
            onChange={(e) => {
              setKdStavka(e.target.value - 1);
              kolicina.current.focus();
            }}
          >
            <option disabled={true} value="">
              --IZBOR USLUGE--
            </option>
            {kd
              ? kd.map((item, indkd) => (
                  <option key={indkd} value={item.r_br}>
                    {item.r_br}. {item.opis_usluge}
                  </option>
                ))
              : null}
          </select>
          <input
            type="number"
            style={{
              marginLeft: "15px",
              height: "2rem",
              fontSize: "large",
              textAlign: "center",
            }}
            placeholder="Ком"
            ref={kolicina}
            onKeyUp={(e) => {
              if (e.key === "Enter" && parseInt(kolicina.current.value) > 0)
                handleSubmit();
              else if (e.key === "Enter")
                setMessage("Unesite ispravnu kolicinu!");
            }}
          ></input>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "11cm 11cm",
            textAlign: "left",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "4cm 6cm" }}>
            <span style={{ marginTop: "7px", marginLeft: "2px" }}>
              <strong>Mesto/Ogranak:</strong>
            </span>
            <input
              type="text"
              ref={mestoRef}
              placeholder="ogranak..."
              defaultValue={
                narudzbenica && narudzbenica.mesto?.length
                  ? narudzbenica.mesto
                  : trafoStanica.ed
              }
              onBlur={() =>
                setMesto(
                  serbianTransliteration.toCyrillic(mestoRef.current.value)
                )
              }
              style={{ height: "2rem", fontSize: "1rem", paddingLeft: "2px" }}
            ></input>
            <span style={{ marginTop: "7px", marginLeft: "2px" }}>
              <strong>Zavodni broj:</strong>
            </span>
            <input
              type="text"
              ref={zavodniBr}
              defaultValue={narudzbenica?.zavodni_br}
              placeholder="zavodni broj..."
              style={{ height: "2rem", fontSize: "1rem", paddingLeft: "2px" }}
            ></input>
            <span style={{ marginTop: "7px", marginLeft: "2px" }}>
              <strong>Broj narudzbenice:</strong>
            </span>
            <input
              type="text"
              style={{ height: "2rem", fontSize: "1rem", paddingLeft: "2px" }}
              defaultValue={narudzbenica?.broj_narudzbenice}
              ref={brNarudz}
              placeholder="broj narudzbenice..."
            ></input>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "5cm 5cm" }}>
            <span style={{ marginTop: "7px", marginLeft: "2px" }}>
              <strong>Broj internog naloga:</strong>
            </span>
            <input
              type="text"
              ref={brSap}
              defaultValue={narudzbenica?.br_sap}
              placeholder="SAP br..."
              style={{ height: "2rem", fontSize: "1rem", paddingLeft: "2px" }}
            ></input>
            <span style={{ marginTop: "7px", marginLeft: "2px" }}>
              <strong>Datum kreiranja narudzbenice:</strong>
            </span>
            <input
              type="date"
              ref={datumNar}
              defaultValue={narudzbenica?.datum}
              placeholder="datum kreiranja..."
              style={{ height: "2rem", fontSize: "1rem", paddingLeft: "2px" }}
            ></input>
            <span style={{ marginTop: "7px", marginLeft: "2px" }}>
              <strong>Datum izdavanja narudzbenice:</strong>
            </span>
            <input
              type="date"
              defaultValue={narudzbenica?.datum2}
              ref={datumNar2}
              style={{ height: "2rem", fontSize: "1rem", paddingLeft: "2px" }}
              placeholder="datum izdavanja..."
            ></input>
          </div>
        </div>
      </>
      <div>
        {!greska ? (
          <button
            className="block-btn"
            onClick={handleOrder}
            style={{
              display: "inline-block",
              marginTop: "10px",
              marginLeft: "0",
            }}
          >
            S a c u v a j
          </button>
        ) : (
          <button
            className="block-btn"
            onClick={handleQuit}
            style={{
              display: "inline-block",
              marginTop: "10px",
              marginLeft: "0",
            }}
          >
            Odustani od narudzbenice (greska u narudzbenici)
          </button>
        )}
      </div>
      <div className="newOrder">
        <h4 style={{ margin: "0.6rem" }}>
          Napomena: dupli klik na Redni Broj brise stavku...
        </h4>
        <div className="orderDetails">
          <span>RBr</span>
          <span>KD</span>
          <span>Naziv usluge</span>
          <span>Jed.</span>
          <span>Kol</span>
          <span>Cena</span>
          <span>Iznos</span>
        </div>
        {orderDetails?.length
          ? orderDetails.map((i, index) => {
              return (
                <div className="orderDetails" key={index}>
                  <span onDoubleClick={() => deleteItem(index)}>
                    {index + 1}
                  </span>
                  <span>{i.pos}</span>
                  <span>{i.opis}</span>
                  <span>kom</span>
                  <span>{i.kol}</span>
                  <span>{i.cena}</span>
                  <span>{i.kol * i.cena}</span>
                </div>
              );
            })
          : null}
        <div className="orderTotal">
          <span>Ukupno: </span>
          <span>{total}</span>
          <span>PDV: </span>
          <span>{total * 0.2}</span>
          <span>Ukupno sa PDV: </span>
          <span>{total * 1.2}</span>
        </div>
      </div>
    </div>
  );
};

export default Order;
