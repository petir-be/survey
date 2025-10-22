import './global.css'
import Home from './pages/Home'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'



function Layout() {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      }
    ]
  }
])


function App() {

  return (
    <>
      <div>
        <div>
          <RouterProvider router = {router}/>
        </div>
      </div>
    </>
  )
}

export default App
