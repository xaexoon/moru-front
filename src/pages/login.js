import { useState } from "react";
import "./login_kim.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div class="App">
      <header class="App-header"></header>
      <div class="container">
        <div class="loginContainer">
          <div class="icon"></div>
          <p class="loginText"> Welcom back</p>
          <p class="descriptionText">Sign in to continue</p>
          <form class="inputContainer">
            <input
              class="loginInput"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              class="loginInput"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button class="loginBtn" type="submit">
              Login
            </button>
          </form>
          <p class="socialText">Or sign in with</p>
        </div>
      </div>
      <body>로그인 Content</body>
    </div>
  );
}

export default Login;
