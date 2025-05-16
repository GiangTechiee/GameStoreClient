import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center" ref={searchRef}>
      <button
        onClick={toggleSearch}
        className="text-gray-800 hover:text-yellow-500 transition-colors duration-200"
      >
        <Search size={24} />
      </button>
      <div
        className={`absolute right-10 top-1/2 transform -translate-y-1/2 bg-gray-100 rounded-full shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <div className="flex items-center px-3 py-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full outline-none text-gray-800 bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;