import { useState } from "react";
import "./login_kim.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="container">
        <div className="loginContainer">
          <div className="icon"></div>
          <p className="loginText"> Welcom back</p>
          <p className="descriptionText">Sign in to continue</p>
          <form className="inputContainer">
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
