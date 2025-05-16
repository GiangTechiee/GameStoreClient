import { useState } from "react";

function DesktopSidebar({ activeFilter, onFilterChange, categories, handleFilterClick }) {
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const platforms = [
    { name: "PC", endpoint: "/Game/platform/PC", filter: "platform-pc" },
    { name: "PlayStation", endpoint: "/Game/platform/PS", filter: "platform-playstation" },
    { name: "Xbox", endpoint: "/Game/platform/Xbox", filter: "platform-xbox" },
    { name: "Nintendo Switch", endpoint: "/Game/platform/NS", filter: "platform-nintendo" },
    { name: "iOS", endpoint: "/Game/platform/iOS", filter: "platform-ios" },
    { name: "Android", endpoint: "/Game/platform/Android", filter: "platform-android" },
  ];

  return (
    <aside className="hidden md:block w-64 bg-white shadow-md">
      <div className="p-4">
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleFilterClick("/Game/sort/release-date", "new")}
                className={`w-full text-left px-4 py-2 rounded-3xl ${
                  activeFilter === "new" ? "bg-purple-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Mới cập nhật
              </button>
            </li>
            <li>
              <button
                onClick={() => handleFilterClick("/Game/sort/view-count", "views")}
                className={`w-full text-left px-4 py-2 rounded-3xl ${
                  activeFilter === "views" ? "bg-purple-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Được xem nhiều
              </button>
            </li>
            <li>
              <button
                onClick={() => handleFilterClick("/Game/goty/true", "goty")}
                className={`w-full text-left px-4 py-2 rounded-3xl ${
                  activeFilter === "goty" ? "bg-purple-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                GOTY
              </button>
            </li>
            <li>
              <button
                onClick={() => handleFilterClick("/Game/category/1", "software")}
                className={`w-full text-left px-4 py-2 rounded-3xl ${
                  activeFilter === "software" ? "bg-purple-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Phần mềm
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 rounded-3xl text-gray-600 hover:bg-gray-100"
                disabled
              >
                Thủ thuật (Coming Soon)
              </button>
            </li>
            {/* Platform Dropdown */}
            <li>
              <button
                onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                className="w-full text-left px-4 py-2 rounded-3xl text-gray-600 hover:bg-gray-100 flex justify-between items-center"
              >
                Nền tảng
                <svg
                  className={`w-4 h-4 transform ${isPlatformOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isPlatformOpen && (
                <ul className="ml-4 mt-1 space-y-1">
                  {platforms.map((platform) => (
                    <li key={platform.filter}>
                      <button
                        onClick={() => handleFilterClick(platform.endpoint, platform.filter)}
                        className={`w-full text-left px-4 py-1 rounded-3xl ${
                          activeFilter === platform.filter
                            ? "bg-purple-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {platform.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {/* Category Dropdown */}
            <li>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full text-left px-4 py-2 rounded-3xl text-gray-600 hover:bg-gray-100 flex justify-between items-center"
              >
                Thể loại
                <svg
                  className={`w-4 h-4 transform ${isCategoryOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isCategoryOpen && (
                <ul className="ml-4 mt-1 space-y-1">
                  {categories.map((category) => (
                    <li key={category.categoryId}>
                      <button
                        onClick={() =>
                          handleFilterClick(`/Game/category/${category.categoryId}`, `category-${category.categoryId}`)
                        }
                        className={`w-full text-left px-4 py-1 rounded-3xl ${
                          activeFilter === `category-${category.categoryId}`
                            ? "bg-purple-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default DesktopSidebar;