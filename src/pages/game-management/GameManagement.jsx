import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../services/api';
import { toast } from 'react-toastify';
import GameCard from './GameCard';
import GameForm from './GameForm';
import GameDetailsModal from './GameDetailsModal';

const GameManagement = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    gameId: null,
    title: '',
    description: '',
    price: '',
    releaseDate: '',
    platform: '',
    developers: '',
    publishers: '',
    website: '',
    viewCount: 0,
    isGOTY: false,
    categoryIds: [],
    imageUrls: [],
    tempImageUrl: '',
  });

  // Fetch data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [gamesData, categoriesData] = await Promise.all([
          apiRequest('/game/game-admin'), // Use admin endpoint
          apiRequest('/category'),
          
        ]);
        console.log("Games data:", gamesData);
        if (mounted) {
          setGames(gamesData);
          setCategories(categoriesData);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Không tải được dữ liệu: ' + err.message);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Open add modal
  const openAddModal = useCallback(() => {
    setFormData({
      gameId: null,
      title: '',
      description: '',
      price: '',
      releaseDate: '',
      platform: '',
      developers: '',
      publishers: '',
      website: '',
      viewCount: 0,
      isGOTY: false,
      categoryIds: [],
      imageUrls: [],
      tempImageUrl: '',
    });
    setIsAddModalOpen(true);
  }, []);

  // Close add modal
  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  // Open details or edit modal
  const openDetailsModal = useCallback((game, isEditing = false) => {
    console.log("Selected game:", game);
    setSelectedGame(game);
    setEditMode(isEditing);
  }, []);

  // Close details modal
  const closeDetailsModal = useCallback(() => {
    setSelectedGame(null);
    setEditMode(false);
  }, []);

  // Add game
  const handleAddGame = useCallback(
    async (e, data) => {
      e.preventDefault();
      try {
        const response = await apiRequest('/game', 'POST', {
          title: data.title,
          description: data.description,
          price: parseFloat(data.price),
          releaseDate: data.releaseDate,
          platform: data.platform,
          developers: data.developers,
          publishers: data.publishers,
          website: data.website || null,
          isGOTY: data.isGOTY,
          categoryIds: data.categoryIds,
          imageUrls: data.imageUrls,
        });

        // Construct categoryNames from categoryIds and categories
        const categoryNames = data.categoryIds.map((id) =>
          categories.find((cat) => cat.categoryId === id)?.name || 'Unknown'
        );

        // Add the new game to the state with constructed gameCategories
        setGames((prev) => [
          ...prev,
          {
            ...response,
            categoryNames,
            categoryIds: data.categoryIds,
            gameImages: data.imageUrls.map((url) => ({ imageUrl: url })),
          },
        ]);
        setIsAddModalOpen(false);
        toast.success('Thêm game thành công!');
      } catch (err) {
        toast.error('Không thêm được game: ' + err.message);
      }
    },
    [categories]
  );

  // Update game
  const handleUpdateGame = useCallback(
    async (e, data) => {
      e.preventDefault();
      try {
        await apiRequest(`/game/${data.gameId}`, 'PUT', {
          title: data.title,
          description: data.description,
          price: parseFloat(data.price),
          releaseDate: data.releaseDate,
          platform: data.platform,
          developers: data.developers,
          publishers: data.publishers,
          website: data.website || null,
          isGOTY: data.isGOTY,
          categoryIds: data.categoryIds,
          imageUrls: data.imageUrls,
        });

        // Construct categoryNames from categoryIds and categories
        const categoryNames = data.categoryIds.map((id) =>
          categories.find((cat) => cat.categoryId === id)?.name || 'Unknown'
        );

        // Update the game in the state
        setGames((prev) =>
          prev.map((game) =>
            game.gameId === data.gameId
              ? {
                  ...data,
                  categoryNames,
                  categoryIds: data.categoryIds,
                  gameImages: data.imageUrls.map((url) => ({ imageUrl: url })),
                }
              : game
          )
        );
        setSelectedGame(null);
        setEditMode(false);
        toast.success('Cập nhật game thành công!');
      } catch (err) {
        toast.error('Không cập nhật được game: ' + err.message);
      }
    },
    [categories]
  );

  // Delete game
  const handleDeleteGame = useCallback(async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa game này?')) {
      try {
        await apiRequest(`/game/${id}`, 'DELETE');
        setGames((prev) => prev.filter((game) => game.gameId !== id));
        setSelectedGame(null);
        setEditMode(false);
        toast.success('Xóa game thành công!');
      } catch (err) {
        toast.error('Không xóa được game: ' + err.message);
      }
    }
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý game</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
        >
          Thêm game
        </button>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Thêm game mới</h2>
            <GameForm
              mode="add"
              gameData={formData}
              setGameData={setFormData}
              categories={categories}
              onSubmit={handleAddGame}
              onCancel={closeAddModal}
            />
          </div>
        </div>
      )}

      {/* Game Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {games.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center">Không tìm thấy game nào.</p>
        ) : (
          games.map((game) => (
            <GameCard
              key={game.gameId}
              game={game}
              onEdit={openDetailsModal}
              onDelete={handleDeleteGame}
              onClick={openDetailsModal}
            />
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedGame && (
        <GameDetailsModal
          game={selectedGame}
          categories={categories}
          onUpdate={handleUpdateGame}
          onDelete={handleDeleteGame}
          onClose={closeDetailsModal}
          isEditing={editMode}
        />
      )}
    </div>
  );
};

export default GameManagement;