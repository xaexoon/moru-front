/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const evtFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: email,
          password: password,
        }),
      });

      const data = await res.json();

      console.log("response : ", data);
    } catch (err) {
      console.log("Login Error");
    }
  };

  return (
    <div className="app">
      <header className="App-header"></header>
      <div className="container">
        <div className="loginContainer">
          <div className="icon"></div>
          <p className="loginText"> Welcom back</p>
          <p className="descriptionText">Sign in to continue</p>
          <form className="inputContainer" onSubmit={evtFormSubmit}>
            <input
              className="loginInput"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="loginInput"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="loginBtn" type="submit">
              Login
            </button>
          </form>
          <p className="socialText">Or sign in with</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
