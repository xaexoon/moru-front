/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/login/login";
import Inventory from "./pages/inventory/Inventory";
import Layout from "./components/Layout";
import CreateCard from "./pages/createCard/CreateCard";
import MyDeck from "./pages/myDeck/MyDeck";
import Feed from "./pages/feed/Feed";
import FeedDetail from "./pages/feed/FeedDetail";
import DataFields from "./pages/dataFields/DataFields";
import Profile from "./pages/profile/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
                  <Feed />
                </Layout>
              }
            />
            <Route
              path="/feed/:id"
              element={
                <Layout>
                  <FeedDetail />
                </Layout>
              }
            />
            <Route
              path="/dataFields"
              element={
                <Layout>
                  <DataFields />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;