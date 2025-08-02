import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Home', href: '/' },
      { name: 'Events', href: '/events' }
    ];

    if (user) {
      baseItems.push({ name: 'My Bookings', href: '/my-bookings' });
    }

    if (user?.role === 'admin') {
      baseItems.push({ name: 'Admin', href: '/admin' });
    }

    return baseItems;
  };

  const renderDesktopNavigation = () => (
    <nav className="hidden md:flex space-x-8">
      {getNavigationItems().map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );

  const renderAuthButtons = () => (
    <div className="hidden md:flex items-center space-x-4">
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            Welcome, {user.name}
          </span>
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-700 hover:text-primary-600 text-sm font-medium">
            Login
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Register
          </Link>
        </div>
      )}
    </div>
  );

  const renderMobileMenuButton = () => (
    <div className="md:hidden">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-700 hover:text-primary-600"
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>
    </div>
  );

  const renderMobileNavigation = () => (
    isMenuOpen && (
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          {getNavigationItems().map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <div className="pt-4 border-t border-gray-200">
              <div className="px-3 py-2 text-sm text-gray-700">
                Welcome, {user.name}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">EventEase</span>
            </Link>
          </div>

          {renderDesktopNavigation()}
          {renderAuthButtons()}
          {renderMobileMenuButton()}
        </div>

        {renderMobileNavigation()}
      </div>
    </header>
  );
};

export default Header; 