import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import { motion } from 'framer-motion';

function BottomBar({ user, handleLogout, isMobileMenuOpen, toggleMobileMenu }) {
  return (
    <>
      <motion.div
        className="hidden md:block bg-gradient-to-r from-purple-700 to-red-700 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex justify-center items-center">
          <DesktopMenu user={user} handleLogout={handleLogout} />
        </div>
      </motion.div>
      <MobileMenu
        user={user}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
    </>
  );
}

export default BottomBar;