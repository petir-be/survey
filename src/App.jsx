import "./global.css";
import { createBrowserRouter } from "react-router";

function Layout() {
  return (
    <>
      <ShaderBackground />

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
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/Workspaces",
            element: <Workspaces />,
          },
        ],
      },
      {
        path: "/faq",
        element: <Kabadingan />,
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
    element: <ProtectedRoute />,
    children: [
      {
        path: "/newform/:id",
        element: <Form />,
      },
      {
        path: "/newform/:id/responses",
        element: <Results />,
      },
    ],
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
]);

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-transparent">
        <div className="min-h-screen ">
          <RouterProvider router={router} />
        </div>
      </div>
    </>
  );
}

export default App;