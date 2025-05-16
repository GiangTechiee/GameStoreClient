import { useState, useEffect } from "react";
import { apiRequest } from "../../../services/api";
import { toast } from "react-toastify";
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";

function Sidebar({ activeFilter, onFilterChange }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiRequest("/category");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh sách thể loại.", { autoClose: 2000 });
      }
    };
    fetchCategories();
  }, []);

  const handleFilterClick = (endpoint, filter) => {
    onFilterChange(endpoint, filter);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <DesktopSidebar
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        categories={categories}
        handleFilterClick={handleFilterClick}
      />
      <MobileSidebar
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        categories={categories}
        handleFilterClick={handleFilterClick}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  );
}

export default Sidebar;
