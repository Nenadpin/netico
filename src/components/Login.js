import React, { useEffect, useState, useContext } from "react";
import ReportContext from "../Context";

const Login = ({ setLoadData }) => {
  const { setRole, neticoUser, setNeticoUser } = useContext(ReportContext);
  const [users, setUsers] = useState(null);
  const [pass, setPass] = useState("");

  const getUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users`);
      const jsonData = await response.json();
      //console.log(jsonData);
      setUsers(jsonData);
    } catch (err) {
      alert("greska na serveru");
    }
  };

  const handleLogin = async (e) => {
    setLoadData(true);
    e.preventDefault();
    const name = neticoUser;
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
      if (loginData.role) {
        setRole(loginData.role);
        setLoadData(false);
      }
    } catch (err) {
      alert("Greska na serveru ili je lozinka pogresna!");
      setLoadData(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <form onSubmit={handleLogin}>
      <div className="form-row">
        <select
          style={{ width: "100%" }}
          onFocus={(e) => {
            e.target.selectedIndex = 0;
          }}
          autoFocus
          type="text"
          value={neticoUser ? neticoUser : ""}
          onChange={(e) => setNeticoUser(e.target.value)}
        >
          <option disabled={true} value="">
            {users ? "--USER--" : "Contacting server..."}
          </option>
          {users?.map((user, index) => (
            <option key={index} value={user.ime}>
              {user.ime}
            </option>
          ))}
        </select>
        <input
          type="password"
          style={{ height: "2rem", width: "100%" }}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button style={{ marginLeft: "0" }} className="block-btn">
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
