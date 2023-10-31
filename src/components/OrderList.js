import React, { useMemo } from "react";
import { useState } from "react";

const OrderList = ({ orders, sviUgovori }) => {
  const [dispOrders, setDispOrd] = useState([]);
  useMemo(() => {
    if (orders) {
      let d = orders;
      setDispOrd(d);
    }
  }, [orders]);

  const filterOrder = (sifra) => {
    let newDisp = dispOrders.filter((d) => d.sifra_ugovora === sifra);
    setDispOrd(newDisp);
  };
  return (
    <div className="nav-center">
      <table>
        <thead>
          <tr>
            <th>Br. narudzbenice</th>
            <th>TS Sifra</th>
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
                  setDispOrd(orders);
                }}
                autoFocus
                type="text"
                onChange={(e) => {
                  filterOrder(e.target.value);
                  e.target.blur();
                }}
              >
                <option disabled={true} value="">
                  Ugovor
                </option>
                {sviUgovori.map((ug, index) => (
                  <option key={index} value={ug.oznaka}>
                    {ug.oznaka}
                  </option>
                ))}
              </select>
            </th>
            <th>Trafo Stanica</th>
            <th>Daum nar.</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders
            ? dispOrders.map((o, idx) => (
                <tr key={idx}>
                  <td>{o.broj_narudzbenice}</td>
                  <td>{o.sifra_ts}</td>
                  <td>{o.sifra_ugovora}</td>
                  <td>{o.naziv}</td>
                  <td>
                    {o.datum.substring(8, 10) +
                      "." +
                      o.datum.substring(5, 7) +
                      "." +
                      o.datum.substring(0, 4) +
                      "."}
                  </td>
                  <td>{o.operativno}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
