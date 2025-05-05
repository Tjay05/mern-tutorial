import { Link, Outlet } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  }
  
  return (
    <>
      <header>
        <div className="container">
          <Link to='/'>
            <h1>Workout Budyy</h1>
          </Link>
          <nav>
            {user && (
              <div>
                <span>{user.email}</span>
                <button onClick={handleClick} >Log out</button>
              </div>
            )}
            {!user && (
              <div>
                <Link to='/login'>Login</Link>
                <Link to='/signup'>Signup</Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <div className="pages">
        <Outlet/>
      </div>
    </>
  );
}
 
export default Navbar;