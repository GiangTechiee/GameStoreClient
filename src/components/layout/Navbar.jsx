import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import SearchModal from './SearchModal';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <TopBar
        toggleSearchModal={toggleSearchModal}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        user={user}
        handleLogout={handleLogout}
      />
      <BottomBar
        user={user}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        toggleSearchModal={toggleSearchModal}
      />
    </header>
  );
}

export default Navbar;