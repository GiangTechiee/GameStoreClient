import { useState, useEffect, useRef } from "react";
import { Search, X} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SearchModal({ isOpen, toggleSearchModal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef(null);

  const clearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleSearchModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleSearchModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-3xl p-6 w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <Search size={24} className="text-gray-500 mr-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-lg text-gray-800 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-yellow-500 transition-colors duration-200 py-2"
                style={{ borderRadius: 0 }}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-gray-500 hover:text-gray-700 ml-4"
                >
                  <X size={24} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;