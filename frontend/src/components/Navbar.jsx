import { Link, Outlet } from 'react-router-dom';

const Navbar = () => {
  
  return (
    <>
      <header>
        <div className="container">
          <Link to='/'>
            <h1>Workout Budyy</h1>
          </Link>
        </div>
      </header>
      <div className="pages">
        <Outlet/>
      </div>
    </>
  );
}
 
export default Navbar;