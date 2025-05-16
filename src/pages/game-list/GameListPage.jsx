import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import GameCard from "./GameCard";
import Sidebar from "./sidebar/Sidebar";
import { apiRequest } from "../../services/api";

function GameListPage() {
  const [games, setGames] = useState([]);
  const [activeFilter, setActiveFilter] = useState("new");
  const location = useLocation();

  const fetchGames = async (endpoint, filter) => {
    try {
      const data = await apiRequest(endpoint);
      setGames(data);
      setActiveFilter(filter);
    } catch {
      toast.error("Không thể tải danh sách game");
    }
  };

  // useEffect(() => {
  //   fetchGames("/Game/sort/release-date", "new");
  // }, []);

  // const handleFilterChange = (endpoint, filter) => {
  //   fetchGames(endpoint, filter);
  // };

  useEffect(() => {
    // Kiểm tra nếu có state từ CategoryList
    const { api, filter } = location.state || {};
    if (api && filter) {
      fetchGames(api, filter);
    } else {
      // Mặc định nếu không có state
      fetchGames("/Game/sort/release-date", "new");
    }
  }, [location.state]);

  const handleFilterChange = (endpoint, filter) => {
    fetchGames(endpoint, filter);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
      <main className="flex-1 p-6">
        <h1 className="text-full font-bold text-gray-800 mb-6">
          {activeFilter === "new" && "Game mới cập nhật"}
          {activeFilter === "views" && "Game được xem nhiều"}
          {activeFilter === "goty" && "Game of the year"}
          {activeFilter === "software" && "Phần mềm"}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.length > 0 ? (
            games.map((game) => <GameCard key={game.gameId} game={game} />)
          ) : (
            <p className="text-gray-600 col-span-full">Không tìm thấy game.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default GameListPage;
