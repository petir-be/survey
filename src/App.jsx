import "./global.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FAQ from "./components/FAQ.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Login from "./pages/Login.jsx";
<<<<<<< HEAD
import Register from "./pages/Register.jsx";
import Form from "./pages/Form.jsx";
import TestPage from "./pages/TestPage.jsx";
import Preview from "./pages/Preview.jsx";
import Response from "./pages/Response.jsx";
import Results from "./pages/Results.jsx";
import ReviewPage from "./components/ReviewPage.jsx";
import Workspaces from "./pages/Workspaces.jsx";
import Kabadingan from "./pages/Kabadingan.jsx";
import ShaderBackground from './components/ShaderBackground';
=======

>>>>>>> 4404ba5 (auth login jwttoken)
function Layout() {
  return (
    <>
    <ShaderBackground />
      <Navbar />
      <div>
        <Outlet />
      </div>
<<<<<<< HEAD
=======
      <FAQ />
>>>>>>> 4404ba5 (auth login jwttoken)
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
<<<<<<< HEAD
      {
        path: "/Workspaces",
        element: <Workspaces />,
      },
      {
        path: "/faq",
        element: <Kabadingan />,
      },
=======
>>>>>>> 4404ba5 (auth login jwttoken)
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
<<<<<<< HEAD
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
  {
    path: "/preview/:guid",
    element: <Preview />,
  },
  {
    path: "/form/:guid",
    element: <Response />,
  },
  {
    path: "/testreview",
    element: <ReviewPage />,
  },
  {
    path: "/newform/:id/responses",
    element: <Results />,
  },
=======
>>>>>>> 4404ba5 (auth login jwttoken)
]);

function App() {
  return (
    <>
<<<<<<< HEAD
      <div className="min-h-screen flex flex-col bg-transparent">
=======
      <div className="min-h-screen flex flex-col">
>>>>>>> 4404ba5 (auth login jwttoken)
        <div className="min-h-screen ">
          <RouterProvider router={router} />
        </div>
      </div>
    </>
  );
}

export default App;
