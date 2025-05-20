import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

// pages & components
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RequireAuth from './components/RequireAuth';
import RedirectIfAuth from './components/RedirectIfAuth';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<Navbar/>}>
        <Route path='/' element={
          <RequireAuth>
            <Home/>
          </RequireAuth>
        } />
        <Route path='login' element={
          <RedirectIfAuth>
            <Login/>
          </RedirectIfAuth>
        } />
        <Route path='signup' element={
          <RedirectIfAuth>
            <Signup/>
          </RedirectIfAuth>
        } />
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
