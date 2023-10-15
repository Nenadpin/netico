import React from "react";

const Navbar = ({
  role,
  setTrafoStanica,
  setNarudzbenica,
  setTipPrikaza,
  setPrev,
  setChangePass,
  filterTS,
  setUpload,
  setFilter,
  setEditZap,
  setExtra,
  setGreska,
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
              filterTS("finished");
            }}
          >
            Zavrseno
          </li>
          <li
            onClick={() => {
              setTrafoStanica({});
              setNarudzbenica(null);
              setChangePass(false);
              setPrev([]);
              setTipPrikaza(8);
            }}
          >
            Izvestaji
          </li>
        </>
      ) : role === "operator" ? (
        <>
          <li
            onClick={() => {
              setChangePass(false);
              filterTS("nalog");
              setEditZap(false);
              setUpload(false);
              setTipPrikaza(null);
            }}
          >
            Zapisnik sa terena
          </li>
          <li
            onClick={() => {
              setChangePass(false);
              filterTS("operator");
              setEditZap(true);
              setUpload(false);
              setTipPrikaza(null);
            }}
          >
            Izmena zapisnika
          </li>
          <li
            onClick={() => {
              setChangePass(false);
              setEditZap(false);
              filterTS("upload");
              setTipPrikaza(null);
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
              setPrev([]);
              setChangePass(false);
              filterTS("current");
              setExtra(true);
              setGreska(false);
              setUpload(false);
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
              setGreska(false);
              setUpload(false);
              setExtra(false);
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
              setFilter(true);
              setGreska(false);
              setUpload(false);
              setExtra(false);
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
              setGreska(false);
              setUpload(false);
              setExtra(false);
            }}
          >
            Trafostanice
          </li>
          <li
            onClick={() => {
              setTrafoStanica({});
              setChangePass(false);
              setFilter(false);
              setUpload(false);
              setTipPrikaza(7);
              setGreska(false);
              setUpload(false);
              setExtra(false);
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
              setGreska(false);
              setUpload(false);
              setExtra(false);
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
