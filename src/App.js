import { createBrowserRouter, RouterProvider } from "react-router-dom";

import KimLogin from "./test/login_kim";
import Login from "./pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        Component: <Login />,
      },
      {
        path: "/kim/login",
        element: <KimLogin />,
      },
      {
        path: "*",
        element: <div>error page</div>,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
