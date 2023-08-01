import React from "react";
import { useRef, useContext } from "react";
import ReportContext from "../Context";
import { useState } from "react";
import serbianTransliteration from "serbian-transliteration";

const UserNew = () => {
  const { role, users, setMessage, setUsers } = useContext(ReportContext);
  const allRoles = ["admin", "operator", "expert", "tech"];
  const [newRole, setNewRole] = useState(null);
  const imeRef = useRef();
  const telRef = useRef();
  const emailRef = useRef();
  const zvanjeRef = useRef();

  const handleNew = async (e) => {
    e.preventDefault();
    let newUser = {
      ime: serbianTransliteration.toCyrillic(imeRef.current.value),
      role: newRole,
      tel: telRef.current.value.trim(),
      zvanje: serbianTransliteration.toCyrillic(zvanjeRef.current.value),
      email: emailRef.current.value.trim(),
    };
    if (
      users.filter((u) => {
        return u.ime === newUser.ime;
      }).length
    ) {
      setMessage("Vec postoji taj korisnik!");
      return;
    }
    if (newUser.ime && newUser.role && newUser.zvanje) {
      try {
        const token = sessionStorage.getItem(role);
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/novi_user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            body: JSON.stringify(newUser),
          }
        );
        if (response.status === 210) {
          setMessage(
            "Novi korisnik je upisan, password je 1111. Promenite ga sto pre..."
          );
          let newUsers = [...users, newUser];
          setUsers(newUsers);
        } else {
          setMessage("Greska servera...");
          return;
        }
      } catch (error) {
        setMessage("Greska na serveru");
      }
    } else setMessage("Niste popunili neophodne podatke");
  };
  const handleDelete = async (ime) => {
    try {
      const token = sessionStorage.getItem(role);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/del_user/${ime}`,
        {
          method: "DELETE",
          headers: { authorization: token },
        }
      );

      if (response.status === 210) {
        setMessage("Korisnik je obrisan...");
        let newUsers = users.filter((u) => {
          return u.ime !== ime;
        });
        setUsers(newUsers);
      } else {
        setMessage("Greska na serveru");
        return;
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <div style={{ textAlign: "left" }}>
        <table style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <thead>
            <tr>
              <th>r.br</th>
              <th>Ime</th>
              <th>{`Uloga(role)`}</th>
              <th>Telefon</th>
              <th>email</th>
              <th>Zvanje</th>
              <th style={{ color: "red" }}>Obrisi</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, indU) => {
              return (
                <tr key={indU}>
                  <td>{indU + 1}</td>
                  <td>{user.ime}</td>
                  <td>{user.role}</td>
                  <td>{user.telefon}</td>
                  <td>{user.email}</td>
                  <td>{user.zvanje}</td>
                  <td
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Sigurni ste da brisemo korisnika ${user.ime}?`
                        )
                      )
                        handleDelete(users[indU].ime);
                    }}
                  >
                    X
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleNew}>
        <h3>Novi korisnik</h3>
        <div
          style={{
            display: "grid",
            width: "600px",
            gridTemplateColumns: "200px 320px",
            textAlign: "left",
            margin: "auto",
            marginTop: "20px",
            rowGap: "10px",
            marginBottom: "20px",
          }}
        >
          <h3>Ime</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={imeRef}
          ></input>
          <h3>Uloga</h3>
          <select
            style={{ width: "100%" }}
            onFocus={(e) => {
              e.target.selectedIndex = 0;
            }}
            autoFocus
            type="text"
            value={newRole ? newRole : ""}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option disabled={true} value="">
              --ROLE--
            </option>
            {allRoles?.map((r, index) => (
              <option key={index} value={r}>
                {r}
              </option>
            ))}
          </select>
          <h3>Telefon</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={telRef}
          ></input>
          <h3>Zvanje</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={zvanjeRef}
          ></input>
          <h3>email</h3>
          <input
            style={{
              fontFamily: "Arial",
              fontSize: "1.2rem",
              fontWeight: "400",
            }}
            ref={emailRef}
          ></input>
        </div>
        <button type="submit" style={{ marginLeft: "0" }} className="block-btn">
          Upisi u bazu
        </button>
      </form>
    </>
  );
};

export default UserNew;
