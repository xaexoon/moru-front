/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter, Routes, Route } from "react-router-dom";

import KimLogin from "./test/login_kim";
import Login from "./pages/login/login";
import Inventory from "./pages/inventory/Inventory";
import Layout from "./components/Layout";
// import CreateCard from "./pages/createCard/CreateCard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* inventory 화면 */}
        <Route
          path="/"
          element={
            <Layout>
              <Inventory />
            </Layout>
          }
        />
        {/* 카드생성 화면
        <Route
          path="/createCard"
          element={
            <Layout>
              <CreateCard />
            </Layout>
          }
        /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/kim/login" element={<KimLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
