import React, { useEffect, useState, useContext } from "react";
import ReportContext from "../Context";

const Login = () => {
  const { setRole } = useContext(ReportContext);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  const getUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users`);
      const jsonData = await response.json();
      // console.log(jsonData);
      setUsers(jsonData);
    } catch (err) {
      alert("greska na serveru");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const body = { name, pass };
      const loginRes = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const loginData = await loginRes.json();
      if (loginRes.status === 403) alert("pogresna lozinka...");
      else setRole(loginData.role);
    } catch (err) {
      alert("Greska na serveru!");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <form onSubmit={handleLogin}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "600px",
          margin: "auto",
        }}
      >
        <select
          style={{ margin: "0" }}
          onFocus={(e) => {
            e.target.selectedIndex = 0;
          }}
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        >
          <option disabled={true} value="">
            --USER--
          </option>
          {users.map((user, index) => (
            <option key={index} value={user.ime}>
              {user.ime}
            </option>
          ))}
        </select>
        <input
          type="password"
          style={{ height: "2rem" }}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button style={{ padding: "5px", margin: "0" }}>Login</button>
      </div>
    </form>
  );
};

export default Login;
