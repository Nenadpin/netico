import { createContext, useState } from "react";

const ReportContext = createContext({});

export const ReportProvider = ({ children }) => {
  const [trafoStanica, setTrafoStanica] = useState({}); //globalna trenutno izabrana trafoStanica
  const [polja, setPolja] = useState([]); //niz polja izabrane trafostanice sa naponom
  const [stanja, setStanja] = useState([]); //niz stanja elemenata na datom ispitivanju
  const [narudzbenica, setNarudzbenica] = useState(null); //stanje objekta narudzbenica(ako postoji tekuca je curr, a ako ne, niz allOrders koji se mapira)
  const [elHist, setElHist] = useState(null); //stanje iteratora kroz razlicite izbore (ispititivanja, izvestaja i svega sto se indeksima mapira)
  const [history, setHistory] = useState(null); //istorija stanja elemenata za izabrano ispitivanje
  const [mesto, setMesto] = useState("");
  const [ispList, setIspList] = useState([]); //lista svih ispitivanja za izabranu TS
  const [tipPrikaza, setTipPrikaza] = useState(0);
  const [sviUgovori, setSviUgovori] = useState(null);
  const [kd, setKd] = useState(null);
  const [emplList, setEmplList] = useState(null);
  const [examine, setExamine] = useState(null); //niz stanja elemenata. Koristi se samo u Ispitivanje.js za POST u bazu
  const [sifraIspitivanja, setSifraIspitivanja] = useState(null);
  const [ugovor, setUgovor] = useState({});
  const [allOrders, setAllOrders] = useState(null);
  const [reports, setReports] = useState([]);
  const [tsList, setTsList] = useState([]); // Lokalna lista trafostanica i ispitivanja
  const [pageCount, setPageCount] = useState(0);
  const [prev, setPrev] = useState([]); // Lokalna lista prethodnih ispitivanja
  // const [contract, setContract] = useState({});
  // const [lista, setLista] = useState({});
  // const [ispLista, setIspLista] = useState({});
  // const [napon, setNapon] = useState([]);

  return (
    <ReportContext.Provider
      value={{
        prev,
        tsList,
        trafoStanica,
        polja,
        stanja,
        narudzbenica,
        elHist,
        mesto,
        ispList,
        tipPrikaza,
        sviUgovori,
        kd,
        emplList,
        examine,
        sifraIspitivanja,
        ugovor,
        allOrders,
        reports,
        history,
        pageCount,
        // contract,
        // lista,
        // ispLista,
        // napon,
        setPrev,
        setTsList,
        setTrafoStanica,
        setPolja,
        setStanja,
        setNarudzbenica,
        setElHist,
        setMesto,
        setIspList,
        setTipPrikaza,
        setSviUgovori,
        setKd,
        setEmplList,
        setExamine,
        setSifraIspitivanja,
        setUgovor,
        setAllOrders,
        setReports,
        setHistory,
        setPageCount,
        // setContract,
        // setLista,
        // setIspLista,
        // setNapon,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export default ReportContext;
