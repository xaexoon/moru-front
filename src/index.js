import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Login from "./test/login_kim.tsx";
// import Login from "./pages/login.js";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>
);
