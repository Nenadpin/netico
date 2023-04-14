import React, { useMemo, useRef, useState } from "react";
import serbianTransliteration from "serbian-transliteration";
import { useReactToPrint } from "react-to-print";
import { useContext } from "react";
import ReportContext from "../Context";

const Order = () => {
  const {
    trafoStanica,
    narudzbenica,
    mesto,
    kd,
    sviUgovori,
    ugovor,
    setMesto,
    setUgovor,
  } = useContext(ReportContext);
  const zavodniBr = useRef();
  const brNarudz = useRef();
  const brSap = useRef();
  const datumNar = useRef();
  const datumNar2 = useRef();
  const kolicina = useRef();
  const printRef = useRef();
  const mestoRef = useRef();

  const [kdStavka, setKdStavka] = useState(0);
  const [orderDetails, setOrderDetails] = useState([]);
  const [total, setTotal] = useState(0);

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
    kolicina.current.focus();
    console.log(ugovor.oznaka);
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
      zavodniBr.current.value &&
      brNarudz.current.value &&
      brSap.current.value &&
      datumNar.current.value &&
      datumNar2.current.value &&
      mesto
    ) {
      try {
        const response2 = await fetch("http://localhost:5000/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([
            brNarudz.current.value,
            trafoStanica.sifra_ts,
            total * 1.2,
            "nova",
            datumNar.current.value,
            ugovor.oznaka,
            orderDetails,
            mesto,
            datumNar2.current.value,
            brSap.current.value,
            zavodniBr.current.value,
          ]),
        });
        if (response2.status === 210) {
          alert("primljeno");
          window.location.reload();
        } else {
          alert("neka greska...");
          return;
        }
      } catch (error) {
        console.log(error.message);
      }
    } else alert("Niste popunili sve podatke!");
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Narudzbenica",
    onAfterPrint: () => alert("uspesno"),
  });

  return (
    <div className="order">
      <>
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
                --ИЗБОР УГОВОРА--
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
          <span style={{ marginTop: "7px", marginLeft: "2px" }}>
            <strong>Mesto/Ogranak:</strong>
          </span>
          <input
            type="text"
            ref={mestoRef}
            placeholder="ogranak..."
            defaultValue={narudzbenica?.mesto}
            onBlur={() =>
              setMesto(
                serbianTransliteration.toCyrillic(mestoRef.current.value)
              )
            }
            style={{ height: "2rem", fontSize: "1rem", paddingLeft: "2px" }}
          ></input>
        </div>
        <div className="newOrderChoice">
          <span style={{ marginTop: "7px" }}>
            <strong>Услуга: </strong>
          </span>
          <select
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
              --ИЗБОР УСЛУГЕ--
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          ></input>
        </div>
      </>
      <div>
        <button onClick={handleOrder} style={{ display: "inline-block" }}>
          Упиши у базу
        </button>
        <button onClick={handlePrint}>Сними PDF</button>
      </div>

      <div className="newOrder" id="ord1" ref={printRef}>
        <>
          <div className="newOrderHeader">
            <span>
              <strong>НАРУЧИЛАЦ (КУПАЦ)</strong>
            </span>
            <span>
              <strong>ДОБАВЉАЧ (ИЗВОЂАЧ)</strong>
            </span>
            <span>"Електродистрибуција Србије" д.о.о. Београд</span>
            <span>Назив добављача: "NETICO SOLUTIONS" d.o.o. Ниш</span>
            <span>Булевар уметности бр. 12, Београд, Нови Београд</span>
            <span>Адреса: Хиландарска 20, 18000 Ниш</span>
            <span>Матични број: 07005466</span>
            <span>Матични број: 20213108</span>
            <span>ПИБ: 100001378</span>
            <span>ПИБ: 104701667</span>
            <span>Заводни број документа:</span>
            <input
              type="text"
              ref={zavodniBr}
              defaultValue={narudzbenica?.zavodni_br}
              placeholder="заводни број..."
            ></input>
          </div>
          <div></div>
          <h2 style={{ paddingBottom: "2px" }}>НАРУЏБЕНИЦА</h2>
          <h4>
            <em>која садржи битне елементе уговора</em>
          </h4>
          <div
            style={{
              alignSelf: "baseline",
              display: "flex",
              flexDirection: "column",
              marginLeft: "2cm",
              marginTop: "0.5cm",
              marginBottom: "1cm",
              fontWeight: "bold",
              lineHeight: "0.75cm",
              textAlign: "left",
            }}
          >
            <span>
              НЗН број наруџбенице:
              <input
                type="text"
                defaultValue={narudzbenica?.broj_narudzbenice}
                ref={brNarudz}
                placeholder="број наруџбенице..."
              ></input>
            </span>
            <span>
              Број интерног налога (САП број):
              <input
                type="text"
                ref={brSap}
                defaultValue={narudzbenica?.br_sap}
              ></input>
            </span>
            <span>
              Датум креирања:
              <input
                type="text"
                ref={datumNar}
                defaultValue={narudzbenica?.datum}
                placeholder="датум креирања..."
              ></input>
            </span>
            <span>
              Датум издавања:
              <input
                type="text"
                defaultValue={narudzbenica?.datum2}
                ref={datumNar2}
                placeholder="датум издавања..."
              ></input>
            </span>
          </div>
        </>
        <p style={{ marginBottom: "0.75cm" }}>
          На основу Оквирног споразума број {narudzbenica?.sifra_ugovora} од{" "}
          {ugovor
            ? ugovor.datum_ugovora
            : sviUgovori.filter((ug) => {
                return ug.oznaka === narudzbenica?.sifra_ugovora;
              })[0]?.datum_ugovora}{" "}
          закљученог у поступку јавне набавке предмет: пружање услуге{" "}
          {ugovor
            ? ugovor.opis_ugovora
            : sviUgovori.filter((ug) => {
                return ug.oznaka === narudzbenica?.sifra_ugovora;
              })[0]?.opis_ugovora}
          , издаје се наруџбеница
        </p>
        <div className="orderDetails">
          <span>Р.Бр.</span>
          <span>Поз. из КД</span>
          <span>Назив производа; Предмет оквирног споразума</span>
          <span>Јед. мере</span>
          <span>Количина</span>
          <span>Јединична цена из оквирног споразума (РСД без ПДВ-а)</span>
          <span>ИЗНОС (РСД без ПДВ-а)</span>
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
                  <span>комад</span>
                  <span>{i.kol}</span>
                  <span>{i.cena}</span>
                  <span>{i.kol * i.cena}</span>
                </div>
              );
            })
          : null}
        <div className="orderTotal">
          <span>Укупно: </span>
          <span>{total}</span>
          <span>ПДВ: </span>
          <span>{total * 0.2}</span>
          <span>Укупно са ПДВ-ом: </span>
          <span>{total * 1.2}</span>
        </div>
        <div className="orderFooter">
          <p>
            <strong>Рок и начин плаћања :</strong>У законском року до{" "}
            <strong>45 дана</strong> од дана пријема исправног рачуна
          </p>
          <p>
            <strong>Рок извршења: 90 дана</strong> од дана потврде пријема
            наруџбенице.
          </p>
          <p>
            <strong>
              Место извршења: Огранак: {mesto}, Радови ће бити изведени у{" "}
              {trafoStanica.napon.length === 1 ? (
                <span>{trafoStanica.napon[0]} kV</span>
              ) : trafoStanica.napon.length === 2 ? (
                <span>
                  {trafoStanica.napon[0]} kV i{" "}
                  <span>{trafoStanica.napon[1]} kV</span>{" "}
                </span>
              ) : trafoStanica.napon.length === 3 ? (
                <span>
                  {trafoStanica.napon[0]} kV,{" "}
                  <span>{trafoStanica.napon[1]} kV</span> i{" "}
                  <span>{trafoStanica.napon[2]} kV</span>
                </span>
              ) : trafoStanica.napon.length === 4 ? (
                <span>
                  {trafoStanica.napon[0]} kV,{" "}
                  <span>{trafoStanica.napon[1]} kV, </span>
                  <span>{trafoStanica.napon[2]} kV, </span> i{" "}
                  <span>{trafoStanica.napon[3]} kV</span>
                </span>
              ) : null}
              у ТС "{trafoStanica.naziv}"
            </strong>
          </p>
          <p>
            <strong>Начин примопредаје:</strong> Усвајање Извештаја о
            испитивању. Записник о пруженој услузи - без примедби, у складу са
            чланом 7 Оквирног споразума
          </p>
          <p>
            <strong>
              Уговорна казна због закашњења у извођењу радова биће наплаћена у
              складу са чланом 16 Оквирног споразума
            </strong>
          </p>
          <p>
            Сва права и обавезе дефинисана су Оквирним споразумом број на основу
            којег је издата Наруџбеница
          </p>
          <p>
            <strong>
              Лице које врши надзор над извршењем: Стручни тим, представник ДП у
              Стручном радном тиму
            </strong>
          </p>
        </div>
        <p
          style={{
            display: "block",
            marginTop: "10px",
            alignSelf: "flex-start",
          }}
        >
          Напомена: Достављена је једнополна шема постројења са уцртаним пољима,
          као и елементима над којим се врши{" "}
          <span
            style={{
              fontSize: "0.6rem",
              width: "180px",
              backgroundColor: "transparent",
            }}
          >
            {ugovor?.oznaka === "UG03-110"
              ? "функционално испитивање"
              : "превентивно одржавање"}
          </span>
        </p>
        <div className="potpisi">
          <div>
            <p>
              <strong>Обрадио:</strong>
            </p>
            <p>
              <strong>ОЛЗПР</strong>
            </p>
            <br></br>
            <br></br>
            <p>___________________</p>
            <p>мр Душан Вукотић, дипл.ел.инж</p>
          </div>
          <div>
            <p>
              <strong>НАРУЧИЛАЦ:</strong>
            </p>
            <p>
              <strong>Дирекција за управљање ДЕЕС</strong>
            </p>
            <p>
              <strong>Дирекктор</strong>
            </p>
            <br></br>
            <br></br>
            <p>_________________________</p>
            <p>Далибор Николић, дипл.ел.инж</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
