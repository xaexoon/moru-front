/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute"

import Login from "./pages/login/login";
import SignUp from "./pages/login/SignUp";

import Inventory from "./pages/inventory/Inventory";
import Layout from "./components/Layout";
import CreateCard from "./pages/createCard/CreateCard";
import MyDeck from "./pages/myDeck/MyDeck";
import MyDeckDetail from "./pages/myDeck/MyDeckDetail";
import MyCard from "./pages/myCard/MyCard";
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
            {/* 로그인 페이지는 누구나 접근 가능 */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {/* 보호된 라우트들 */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Inventory />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/createCard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreateCard />
                  </Layout>
                </ProtectedRoute>
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
                <ProtectedRoute>
                  <Layout>
                    <FeedDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dataFields"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DataFields />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/myCard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyCard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/myDeck"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyDeck />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/deck/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyDeckDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workspace"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreateCard />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;