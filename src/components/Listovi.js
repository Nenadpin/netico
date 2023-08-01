import React, { useContext } from "react";
import ReportContext from "../Context";
import List from "./List";

const Listovi = ({ pageCount, no, ispPolja, ispCurr, izvBr, sifra }) => {
  const { history } = useContext(ReportContext);
  let strNo = pageCount - no + 1;
  let del = 1;

  return (
    <>
      {ispPolja
        ? ispPolja.map((polje) =>
            polje.element?.map((ele, ie) => {
              if (history[ele.moja_sifra])
                return (
                  <List
                    polje={polje}
                    ele={ele}
                    pageStr={strNo++}
                    pageCount={pageCount}
                    ispCurr={ispCurr}
                    izvBr={izvBr}
                    delay={100 * del++}
                    sifra={sifra}
                  />
                );
              else return null;
            })
          )
        : null}
    </>
  );
};

export default Listovi;
