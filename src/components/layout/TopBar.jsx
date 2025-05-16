import { useState, useContext } from "react";
import { ShoppingCart, Heart, Menu, Search } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "/src/context/CartContext";
import { motion } from "framer-motion";
import WishlistModal from "./WishlistModal";
import { WishlistContext } from "../../context/WishlistContext";
import { Link } from "react-router-dom";

function TopBar({ toggleSearchModal, isMobileMenuOpen, toggleMobileMenu, user, handleLogout }) {
  const { cartCount } = useCart();
  const { wishlist } = useContext(WishlistContext);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);

  const toggleWishlistModal = () => {
    setIsWishlistModalOpen(!isWishlistModalOpen);
  };

  return (
    <motion.div
      className="p-4 bg-gradient-to-r from-blue-700 to-purple-700 md:bg-white md:shadow-md"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>
          <Logo />
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={toggleSearchModal}
            className="text-white md:text-white hover:text-yellow-500 transition-colors duration-200"
          >
            <Search size={24} />
          </button>
          <Link
            to="/cart"
            className="relative text-white md:text-white hover:text-yellow-500 transition-colors duration-200"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={toggleWishlistModal}
            className="relative text-white md:text-white hover:text-yellow-500 transition-colors duration-200"
          >
            <Heart size={24} className={wishlist.length > 0 ? "fill-current text-red-500" : ""} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>
        </div>
      </div>
      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
      />
    </motion.div>
  );
}

export default TopBar;
