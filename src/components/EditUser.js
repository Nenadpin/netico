import React, { useRef } from "react";

const EditUser = ({
  role,
  neticoUser,
  setChangePass,
  setLoadData,
  setNeticoUser,
}) => {
  const nameRef = useRef();
  const passRef = useRef();
  const repeatRef = useRef();

  const changePassword = async (e) => {
    e.preventDefault();
    let data = {
      oldName: neticoUser,
      name: nameRef.current.value,
      pass: passRef.current.value,
    };
    if (passRef.current.value !== repeatRef.current.value) {
      alert("Lozinke nisu iste!");
      passRef.current.value = "";
      repeatRef.current.value = "";
      return;
    }
    setLoadData(true);
    try {
      const loginRes = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/change`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (loginRes.status === 501) alert("Greska na serveru...");
      else if (loginRes.status === 210) {
        alert("Podaci su uspesno promenjeni");
        setChangePass(false);
        setLoadData(false);
        setNeticoUser(data.name);
      }
    } catch (err) {
      alert("Greska na serveru!");
      setLoadData(false);
    }
  };

  return (
    <form onSubmit={changePassword}>
      <div className="form-row">
        <h4>Role: {role}</h4>
        <input
          type="text"
          ref={nameRef}
          style={{ height: "2rem", width: "100%" }}
          defaultValue={neticoUser}
        />
        <input
          type="password"
          style={{ height: "2rem", width: "100%" }}
          ref={passRef}
          placeholder="Nova lozinka..."
        />
        <input
          type="password"
          style={{ height: "2rem", width: "100%" }}
          ref={repeatRef}
          placeholder="Ponovite lozinku..."
        />
        <button style={{ marginLeft: "0" }} className="block-btn">
          Promeni podatke
        </button>
      </div>
    </form>
  );
};

export default EditUser;
