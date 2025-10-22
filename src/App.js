/* eslint-disable react/react-in-jsx-scope */
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import KimLogin from "./test/login_kim";
import Login from "./pages/login/login";
import Main from "./pages/main/main";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <div>im error</div>,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "kim/login",
        element: <KimLogin />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
