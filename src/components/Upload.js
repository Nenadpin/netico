import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import ReportContext from "../Context";
import Spinner from "./Spinner";

const Upload = () => {
  const {
    narudzbenica,
    ispList,
    setMessage,
    logout,
    role,
    sviUgovori,
    keepWorking,
  } = useContext(ReportContext);
  const [sifra, setSifra] = useState(null);
  const [loadData, setLoadData] = useState(false);
  let acceptedFileTypes = "";
  if (role === "tech") {
    acceptedFileTypes = ".jpg";
  } else if (role === "operator") {
    acceptedFileTypes = ".pdsx, .dfax";
  } else if (role === "admin") {
    acceptedFileTypes = ".pdf";
  }
  useMemo(() => {
    if (narudzbenica) {
      let sif = ispList.filter((i) => {
        return i.narudzbenica === narudzbenica.broj_narudzbenice;
      })[0];
      setSifra(sif?.ugovor + "_ISP" + sif?.sifra + "_" + sif?.r_br);
    }
  }, [narudzbenica]);
  const uploadForm = useRef();

  const sendFiles = async () => {
    const token = sessionStorage.getItem(role);
    const myFiles = document.getElementById("myFiles").files;
    if (myFiles.length > 0) {
      const formData = new FormData();
      setLoadData(true);
      Object.keys(myFiles).forEach((key) => {
        formData.append(myFiles.item(key).name, myFiles.item(key));
      });
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/upload${sifra}`,
          {
            method: "POST",
            headers: {
              authorization: token,
              role: role,
              nar: narudzbenica.broj_narudzbenice,
            },
            body: formData,
          }
        );
        const json = await response.json();
        if (json.status === "success") {
          setMessage("Primljeno!");
          role === "tech"
            ? setTimeout(() => keepWorking(), 2000)
            : setTimeout(() => logout(), 2000);
          setLoadData(false);
        } else {
          setMessage(json.status);
          setLoadData(false);
        }
      } catch (error) {
        setMessage(error.message);
        setLoadData(false);
      }
    } else setMessage("Niste ucitali nijedan fajl...");
  };

  return (
    <>
      {loadData && <Spinner message={"Uploading files to server..."} />}
      {sifra ? (
        <div>
          <p
            style={{ fontSize: "1.5rem", margin: "15px" }}
          >{`Ucitavanje fajlova na server za ispitivanje r.br: ${
            sifra.split("_")[2]
          }`}</p>
          <p
            style={{ fontSize: "1.5rem", margin: "15px", fontWeight: "bold" }}
          >{`Sifra ugovora: ${sifra.split("_")[0]}`}</p>
          {sifra ? (
            <p style={{ fontSize: "1.5rem", margin: "15px" }}>
              {
                sviUgovori.filter((u) => u.oznaka === sifra.split("_")[0])[0]
                  .opis_ugovora
              }
            </p>
          ) : null}
          <p
            style={{ fontSize: "1.5rem", margin: "15px", fontWeight: "bold" }}
          >{`Sifra ispitivanja: ${sifra.split("_")[1]}`}</p>
          <form
            ref={uploadForm}
            id="uploadForm"
            onSubmit={(e) => {
              e.preventDefault();
              sendFiles();
            }}
          >
            <input
              style={{ fontSize: "1.2rem", padding: "5px", height: "2.5rem" }}
              type="file"
              id="myFiles"
              accept={acceptedFileTypes}
              multiple={role === "operator" || role === "admin"}
            />
            <button className="block-btn" style={{ marginLeft: "0" }}>
              Submit
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default Upload;
