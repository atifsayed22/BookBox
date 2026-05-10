import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/"><Logo size="sm" /></Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/" className="text-sm text-gray-600 hover:text-primary">Browse</Link>
              <Link to="/login" className="text-sm text-gray-600 hover:text-primary">Login</Link>
              <Link to="/signup" className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                Sign Up
              </Link>
            </>
          ) : user.role === 'customer' ? (
            <>
              <Link to="/" className="text-sm text-gray-600 hover:text-primary">Browse Services</Link>
              <Link to="/my-bookings" className="text-sm text-gray-600 hover:text-primary">My Bookings</Link>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/vendor/dashboard" className="text-sm text-gray-600 hover:text-primary">Dashboard</Link>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500">Logout</button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
          <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
          <div className="w-5 h-0.5 bg-gray-600"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3">
          {!user ? (
            <>
              <Link to="/" className="block text-sm text-gray-600" onClick={() => setOpen(false)}>Browse</Link>
              <Link to="/login" className="block text-sm text-gray-600" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/signup" className="block text-sm text-primary font-semibold" onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          ) : user.role === 'customer' ? (
            <>
              <Link to="/" className="block text-sm text-gray-600" onClick={() => setOpen(false)}>Browse Services</Link>
              <Link to="/my-bookings" className="block text-sm text-gray-600" onClick={() => setOpen(false)}>My Bookings</Link>
              <button onClick={handleLogout} className="block text-sm text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/vendor/dashboard" className="block text-sm text-gray-600" onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="block text-sm text-red-500">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
