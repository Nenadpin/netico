import { createContext, useState } from "react";

const ReportContext = createContext({});

export const ReportProvider = ({ children }) => {
  const [trafoStanica, setTrafoStanica] = useState({}); //globalna trenutno izabrana trafoStanica
  const [polja, setPolja] = useState([]); //niz polja izabrane trafostanice sa naponom
  const [stanja, setStanja] = useState([]); //niz stanja elemenata na datom ispitivanju
  const [narudzbenica, setNarudzbenica] = useState(null); //stanje objekta narudzbenica(ako postoji tekuca je curr, a ako ne, niz allOrders koji se mapira)
  const [history, setHistory] = useState(null); //istorija stanja elemenata za izabrano ispitivanje
  const [mesto, setMesto] = useState("");
  const [ispList, setIspList] = useState([]); //lista svih ispitivanja za izabranu TS
  const [tipPrikaza, setTipPrikaza] = useState(null);
  const [sviUgovori, setSviUgovori] = useState(null);
  const [kd, setKd] = useState(null);
  const [emplList, setEmplList] = useState(null);
  const [examine, setExamine] = useState(null); //niz stanja elemenata. Koristi se samo u Ispitivanje.js za POST u bazu
  const [sifraIspitivanja, setSifraIspitivanja] = useState(null);
  const [ugovor, setUgovor] = useState();
  const [orders, setOrders] = useState(null);
  const [reports, setReports] = useState([]);
  const [tsList, setTsList] = useState([]); // Lokalna lista trafostanica i ispitivanja
  const [pageCount, setPageCount] = useState(0);
  const [prev, setPrev] = useState([]); // Lokalna lista prethodnih ispitivanja
  const [role, setRole] = useState(null);
  const [neticoUser, setNeticoUser] = useState(null);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [ispEls, setIspEls] = useState(null);
  const [users, setUsers] = useState(null);
  const [upload, setUpload] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [greska, setGreska] = useState(false);

  const logout = () => {
    setRole(null);
    setChangePass(false);
    setUpload(false);
    setNeticoUser(null);
    setTipPrikaza(null);
    setTrafoStanica({});
    sessionStorage.clear();
    window.location.reload();
  };
  const keepWorking = () => {
    setChangePass(false);
    setUpload(false);
    setTipPrikaza(null);
    setNarudzbenica(null);
    setTrafoStanica({});
  };

  return (
    <ReportContext.Provider
      value={{
        changePass,
        greska,
        setGreska,
        setChangePass,
        setUpload,
        upload,
        users,
        setUsers,
        modal,
        ispEls,
        setIspEls,
        setModal,
        prev,
        tsList,
        trafoStanica,
        polja,
        stanja,
        narudzbenica,
        mesto,
        ispList,
        tipPrikaza,
        sviUgovori,
        kd,
        emplList,
        examine,
        sifraIspitivanja,
        ugovor,
        orders,
        reports,
        history,
        pageCount,
        role,
        neticoUser,
        message,
        setMessage,
        setNeticoUser,
        setRole,
        setPrev,
        setTsList,
        setTrafoStanica,
        setPolja,
        setStanja,
        setNarudzbenica,
        setMesto,
        setIspList,
        setTipPrikaza,
        setSviUgovori,
        setKd,
        setEmplList,
        setExamine,
        setSifraIspitivanja,
        setUgovor,
        setOrders,
        setReports,
        setHistory,
        setPageCount,
        logout,
        keepWorking,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export default ReportContext;
