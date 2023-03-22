import React, { useContext, useMemo, useState } from "react";
import ReportContext from "../Context";
import TextareaAutosize from "react-textarea-autosize";
import Header from "./Header";
import Footer from "./Footer";
import napomenaText from "./Misljenje.json";

const Zakljucak = ({ napIzv, str, pageCount }) => {
  const [st, setSt] = useState(0);

  const { history } = useContext(ReportContext);

  useMemo(() => {
    let listItems = Object.keys(history);
    for (let i = 0; i < listItems.length; i++) {
      let item = listItems[i].slice(-4, -2);
      if (item === "ST") setSt((st) => st + 1);
    }
    console.log(history);
    console.log(napIzv);
  }, [history]);

  return (
    <div className="report">
      <Header />
      <textarea
        rows={3}
        style={{
          border: "none",
          width: "18cm",
          textAlign: "left",
          marginTop: "1rem",
          marginRight: "1.5cm",
          marginLeft: "0.5cm",
          fontFamily: "arial",
          fontSize: "1rem",
        }}
        defaultValue={`У прилогу извештаја налазе се засебни испитни листови за сваки од елемената. У испитним листовима дати су подаци о елементима који су испитани и UHF снимци у спектралном и временском моду.`}
      ></textarea>
      <p
        style={{
          display: "block",
          textAlign: "center",
          fontFamily: "Arial",
          fontSize: "1.1rem",
          color: "#0073ce",
          marginTop: "1cm",
        }}
      >
        6 ЗАКЉУЧАК - МИШЉЕЊЕ И ТУМАЧЕЊЕ
      </p>
      {Object.keys(napIzv)
        .sort()
        .reverse()
        .map((pn, iz) => {
          return (
            <div key={iz} style={{ display: "block", textAlign: "left" }}>
              <p
                style={{
                  display: "block",
                  textAlign: "left",
                  marginTop: "1rem",
                  fontFamily: "Arial",
                  fontSize: "1.1rem",
                  color: "#0073ce",
                }}
              >
                6.1 Напонски ниво {pn}kV
              </p>
              <TextareaAutosize
                style={{
                  border: "none",
                  width: "18cm",
                  textAlign: "left",
                  marginTop: "1rem",
                  marginRight: "1.5cm",
                  fontFamily: "arial",
                  fontSize: "1rem",
                }}
                defaultValue={napomenaText?.napomena[1]}
              />
              <p>{`У ${pn}kV делу ТС, ултразвучном методом испитано је ${st},  мерних трансформатора`}</p>
              <p>{napomenaText.baza}</p>
            </div>
          );
        })}
      <Footer str={str} pageCount={pageCount} />
    </div>
  );
};
export default Zakljucak;
