/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter, Routes, Route } from "react-router-dom";

import KimLogin from "./test/login_kim";
import SongLogin from "./test/login_song";
import Login from "./pages/login/login";
import Inventory from "./pages/inventory/Inventory";
import Layout from "./components/Layout";
import CreateCard from "./pages/createCard/CreateCard";
import MyDeck from "./pages/myDeck/MyDeck";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/inventory"
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
        <Route
          path="/createCard"
          element={
            <Layout>
              <CreateCard />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <CreateCard />
            </Layout>
          }
        />

        <Route
          path="/feed"
          element={
            <Layout>
              <CreateCard />
            </Layout>
          }
        />
        <Route
          path="/dataFields"
          element={
            <Layout>
              <CreateCard />
            </Layout>
          }
        />
        <Route
          path="/myDeck"
          element={
            <Layout>
              <MyDeck />
            </Layout>
          }
        />
        <Route
          path="/workspace"
          element={
            <Layout>
              <CreateCard />
            </Layout>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/kim/login" element={<KimLogin />} />
        <Route path="/song/login" element={<SongLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
