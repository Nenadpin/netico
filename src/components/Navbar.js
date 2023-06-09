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
  setFilter,
  setEditZap,
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
              filterTS("operator");
              setEditZap(true);
            }}
          >
            Izmena zapisnika
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
              setTrafoStanica({});
              setNarudzbenica(null);
              setChangePass(false);
              setPrev([]);
              setEdit(false);
              filterTS("finished");
            }}
          >
            Izvestaj
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
          <li
            onClick={() => {
              setTrafoStanica({});
              setChangePass(false);
              setUpload(false);
              filterTS("all");
              setNarudzbenica(null);
              setTipPrikaza(2);
              setFilter(true);
            }}
          >
            Narudzbenica
          </li>
          <li
            onClick={() => {
              setTrafoStanica({});
              setChangePass(false);
              setUpload(false);
              filterTS("nova");
            }}
          >
            Nalog
          </li>
          <li
            onClick={() => {
              setTrafoStanica({});
              setChangePass(false);
              setFilter(false);
              setUpload(false);
              setTipPrikaza(0);
            }}
          >
            Nova TS
          </li>
          <li
            onClick={() => {
              setTrafoStanica({});
              setChangePass(false);
              setFilter(false);
              setUpload(false);
              setTipPrikaza(7);
            }}
          >
            Ugovori
          </li>
          <li
            onClick={() => {
              setTrafoStanica({});
              setChangePass(false);
              setFilter(false);
              setUpload(false);
              setTipPrikaza(8);
            }}
          >
            Korisnici
          </li>
        </>
      ) : null}
    </ul>
  );
};

export default Navbar;
