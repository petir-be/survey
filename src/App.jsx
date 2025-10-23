import './global.css'
import Home from './pages/Home'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FAQ from './components/FAQ.jsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'



function Layout() {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <FAQ/>
      {/* <Footer /> */}
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
      <div className='min-h-screen flex flex-col'>
        <div className='min-h-screen '> 
          <RouterProvider router = {router}/>
        </div>
      </div>
    </>
  )
}

export default App
