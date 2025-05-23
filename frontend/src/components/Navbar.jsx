import { Link, Outlet } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useModalContext } from '../hooks/UseModalContext';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { isModalOpen, setIsModalOpen } = useModalContext();

  const handleClick = () => {
    logout();
  }
  
  return (
    <div className=''>
      <header className='bg-white'>
        <div className="rule py-4 flex items-center justify-between lg:py-5">
          <Link to='/' className='text-[#333] text-lg font-extrabold lg:text-2xl'>
            <h1>Workout Budyy</h1>
          </Link>
          <nav>
            {user && (
              <div className='text-xs flex flex-col items-end lg:flex-row lg:items-center lg:text-lg'>
                <span>{user.email}</span>
                <button onClick={handleClick} className='bg-white text-[#1aac83] border-[2px] cursor-pointer ml-4 px-2 py-1'>Log out</button>
              </div>
            )}
            {!user && (
              <div className='text-xs'>
                <Link to='/login' className='ml-2.5'>Login</Link>
                <Link to='/signup' className='ml-2.5'>Signup</Link>
              </div>
            )}
          </nav>
        </div>
        <p onClick={() => setIsModalOpen(!isModalOpen)} className="text-right rule text-xs text-blue-700 underline italic pb-2 cursor-pointer lg:hidden">Click to add workout</p>
      </header>
      <div className="pages rule py-5">
        <Outlet isModalOpen={isModalOpen}/>
      </div>
    </div>
  );
}
 
export default Navbar;