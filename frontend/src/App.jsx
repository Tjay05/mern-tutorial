import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';

// pages & components
import Home from './pages/Home';
import Navbar from './components/Navbar';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<Navbar/>}>
        <Route path='/' element={<Home/>} />
      </Route>
    </Route>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
