import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function DesktopMenu({ user, handleLogout, resetActiveIcon }) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const userRef = useRef(null);
  const adminRef = useRef(null);
  const role = user?.role || localStorage.getItem('role');

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
  };

  // Keep dropdowns open when hovering over items or nested dropdowns
  const handleUserMouseEnter = () => {
    setIsUserDropdownOpen(true);
  };

  const handleAdminMouseEnter = () => {
    setIsUserDropdownOpen(true); // Keep parent open
    setIsAdminDropdownOpen(true); // Open nested dropdown
  };

  // Close dropdowns only when leaving the entire dropdown structure
  const handleUserMouseLeave = () => {
    setIsUserDropdownOpen(false);
    setIsAdminDropdownOpen(false); // Close nested dropdown when leaving parent
  };

  const handleAdminMouseLeave = () => {
    setIsAdminDropdownOpen(false); // Close only the nested dropdown
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userRef.current &&
        !userRef.current.contains(event.target) &&
        adminRef.current &&
        !adminRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
        setIsAdminDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center space-x-6">
      <Link
        to="/"
        className="text-white font-medium hover:bg-green-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
        onClick={resetActiveIcon}
      >
        Home
      </Link>
      <Link
        to="/games"
        className="text-white font-medium hover:bg-green-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
        onClick={resetActiveIcon}
      >
        Game
      </Link>
      <Link
        to="/support"
        className="text-white font-medium hover:bg-green-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
        onClick={resetActiveIcon}
      >
        Hỗ trợ
      </Link>
      <Link
        to="/about"
        className="text-white font-medium hover:bg-green-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
        onClick={resetActiveIcon}
      >
        Giới thiệu
      </Link>
      {user ? (
        <div
          className="relative"
          ref={userRef}
          onMouseEnter={handleUserMouseEnter}
          onMouseLeave={handleUserMouseLeave}
        >
          <button
            onClick={toggleUserDropdown}
            className="text-white font-medium hover:bg-green-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200 flex items-center"
          >
            {user.fullName}
            <ChevronDown size={16} className="ml-1" />
          </button>
          <AnimatePresence>
            {isUserDropdownOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-1 z-10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {role === 'Admin' && (
                  <div
                    className="relative"
                    ref={adminRef}
                    onMouseEnter={handleAdminMouseEnter}
                    onMouseLeave={handleAdminMouseLeave}
                  >
                    <button
                      onClick={toggleAdminDropdown}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      Admin
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                    <AnimatePresence>
                      {isAdminDropdownOpen && (
                        <motion.div
                          className="absolute right-full top-0 w-48 bg-white rounded shadow-lg py-1 z-10"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to="/admin/categories"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              setIsAdminDropdownOpen(false);
                              resetActiveIcon();
                            }}
                            onMouseEnter={handleAdminMouseEnter}
                          >
                            Quản lý danh mục
                          </Link>
                          <Link
                            to="/admin/games"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              setIsAdminDropdownOpen(false);
                              resetActiveIcon();
                            }}
                            onMouseEnter={handleAdminMouseEnter}
                          >
                            Quản lý game
                          </Link>
                          <Link
                            to="/admin/users"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              setIsAdminDropdownOpen(false);
                              resetActiveIcon();
                            }}
                            onMouseEnter={handleAdminMouseEnter}
                          >
                            Quản lý người dùng
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    resetActiveIcon();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onMouseEnter={handleUserMouseEnter}
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Link
          to="/login"
          className="text-white bg-purple-500 px-4 py-2 rounded-3xl font-medium hover:bg-purple-600 transition-colors duration-200"
          onClick={resetActiveIcon}
        >
          Login
        </Link>
      )}
    </div>
  );
}

export default DesktopMenu;