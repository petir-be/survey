import "./global.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FAQ from "./components/FAQ.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Form from "./pages/Form.jsx";
import TestPage from "./pages/TestPage.jsx";

function Layout() {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <Register />,
  },
  {
      path: "/newform/:id",
      element: <Form />,
  },
  {
    path: "test",
    element: <TestPage />,
  },
]);

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-(--white)">
        <div className="min-h-screen ">
          <RouterProvider router={router} />
        </div>
      </div>
    </>
  );
}

export default App;
