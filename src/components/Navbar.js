import React from "react";

const Navbar = ({
  role,
  setTrafoStanica,
  setNarudzbenica,
  setTipPrikaza,
  setPrev,
  setChangePass,
  setEdit,
  filterTS,
  setUpload,
  setEditZap,
  setFilter,
}) => {
  return (
    <ul>
      {role === "admin" ? (
        <>
          <li
            onClick={() => {
              setTrafoStanica({});
              setNarudzbenica(null);
              setChangePass(false);
              setPrev([]);
              setEdit(false);
              filterTS("finished");
            }}
          >
            Zavrseno
          </li>
          <li
            onClick={() => {
              setTrafoStanica({});
              setPrev([]);
              setEdit(true);
              setChangePass(false);
              filterTS("current");
            }}
          >
            U Toku
          </li>
        </>
      ) : role === "operator" ? (
        <>
          <li
            onClick={() => {
              setChangePass(false);
              filterTS("nalog");
            }}
          >
            Zapisnik sa terena
          </li>
          <li
            onClick={() => {
              setChangePass(false);
              filterTS("upload");
              setUpload(true);
            }}
          >
            Unos fajlova
          </li>
          <li
            onClick={() => {
              setChangePass(false);
              filterTS("upload");
              setEditZap(true);
            }}
          >
            Ispravka zapisnika
          </li>
        </>
      ) : role === "expert" ? (
        <>
          <li
            onClick={() => {
              setChangePass(false);
              filterTS("isp");
            }}
          >
            Analiza
          </li>
        </>
      ) : role === "tech" ? (
        <>
          <li
            onClick={() => {
              setChangePass(false);
              setUpload(false);
              filterTS("all");
              setNarudzbenica(null);
              setTipPrikaza(2);
            }}
          >
            Narudzbenica
          </li>
          <li
            onClick={() => {
              setChangePass(false);
              setUpload(false);
              filterTS("nova");
            }}
          >
            Nalog
          </li>
          <li
            onClick={() => {
              setChangePass(false);
              setFilter(false);
              setUpload(false);
              setTipPrikaza(0);
            }}
          >
            Nova TS
          </li>
        </>
      ) : null}
    </ul>
  );
};

export default Navbar;
