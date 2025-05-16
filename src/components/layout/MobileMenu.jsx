import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function MobileMenu({ user, handleLogout, isMobileMenuOpen, toggleMobileMenu }) {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const menuRef = useRef(null);
  const role = user?.role || localStorage.getItem('role');

  const toggleAdminMenu = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  const toggleUserMenu = () => {
    setIsUserOpen(!isUserOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMobileMenu();
        setIsAdminOpen(false);
        setIsUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleMobileMenu]);

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          ref={menuRef}
          className="md:hidden bg-purple-800 py-4 absolute top-16 left-0 w-full"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto flex flex-col space-y-4 items-start px-4">
            <Link
              to="/"
              className="text-white font-medium hover:bg-yellow-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/games"
              className="text-white font-medium hover:bg-yellow-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
              onClick={toggleMobileMenu}
            >
              Game
            </Link>
            <Link
              to="/support"
              className="text-white font-medium hover:bg-yellow-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
              onClick={toggleMobileMenu}
            >
              Hỗ trợ
            </Link>
            <Link
              to="/about"
              className="text-white font-medium hover:bg-yellow-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
              onClick={toggleMobileMenu}
            >
              Giới thiệu
            </Link>
            {user ? (
              <div className="w-full">
                <button
                  onClick={toggleUserMenu}
                  className="text-white font-medium hover:bg-yellow-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200 flex items-center w-full"
                >
                  {user.fullName}
                  {isUserOpen ? (
                    <ChevronUp size={16} className="ml-1" />
                  ) : (
                    <ChevronDown size={16} className="ml-1" />
                  )}
                </button>
                <AnimatePresence>
                  {isUserOpen && (
                    <motion.div
                      className="flex flex-col space-y-2 mt-2 pl-4"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {role === 'Admin' && (
                        <>
                          <button
                            onClick={toggleAdminMenu}
                            className="text-white font-medium hover:bg-yellow-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200 flex items-center w-full"
                          >
                            Admin
                            {isAdminOpen ? (
                              <ChevronUp size={16} className="ml-1" />
                            ) : (
                              <ChevronDown size={16} className="ml-1" />
                            )}
                          </button>
                          <AnimatePresence>
                            {isAdminOpen && (
                              <motion.div
                                className="flex flex-col space-y-2 mt-2 pl-4"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Link
                                  to="/admin/categories"
                                  className="text-white font-medium hover:bg-yellow-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
                                  onClick={toggleMobileMenu}
                                >
                                  Quản lý danh mục
                                </Link>
                                <Link
                                  to="/admin/games"
                                  className="text-white font-medium hover:bg-yellow-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
                                  onClick={toggleMobileMenu}
                                >
                                  Quản lý game
                                </Link>
                                <Link
                                  to="/admin/users"
                                  className="text-white font-medium hover:bg-yellow-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200"
                                  onClick={toggleMobileMenu}
                                >
                                  Quản lý người dùng
                                </Link>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMobileMenu();
                        }}
                        className="text-white font-medium hover:bg-yellow-500 hover:text-gray-800 px-3 py-2 rounded-full transition-all duration-200 text-left"
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
                className="text-white bg-blue-500 px-4 py-2 rounded-full font-medium hover:bg-purple-600 transition-colors duration-200"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
