import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import ReportContext from "../Context";

const Upload = () => {
  const { narudzbenica, ispList } = useContext(ReportContext);
  const [sifra, setSifra] = useState(null);
  useMemo(() => {
    if (narudzbenica) {
      let sif = ispList.filter((i) => {
        return i.narudzbenica === narudzbenica.broj_narudzbenice;
      })[0]?.r_br;
      setSifra(sif);
    }
  }, [narudzbenica]);
  const uploadForm = useRef();

  const sendFiles = async () => {
    const myFiles = document.getElementById("myFiles").files;
    const formData = new FormData();
    Object.keys(myFiles).forEach((key) => {
      formData.append(myFiles.item(key).name, myFiles.item(key));
    });
    const isp = "ISP" + sifra;
    const response = await fetch(`http://localhost:5000/upload${isp}`, {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    if (json.status === "success") {
      alert("Primljeno!");
      window.location.reload();
    }
  };

  return (
    <>
      {sifra ? (
        <div>
          <p
            style={{ fontSize: "1.5rem", margin: "15px" }}
          >{`Ucitavanje snimaka na server za ispitivanje br:${sifra}`}</p>

          <form
            ref={uploadForm}
            id="uploadForm"
            onSubmit={(e) => {
              e.preventDefault();
              sendFiles();
            }}
          >
            <input
              style={{ fontSize: "1.5rem" }}
              type="file"
              id="myFiles"
              accept="*"
              multiple
            />
            <button>Submit</button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default Upload;
