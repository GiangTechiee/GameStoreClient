import { useState } from 'react';
import { toast } from 'react-toastify';

const GameForm = ({ mode, gameData, setGameData, categories, onSubmit, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGameData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setIsEditing(true);
  };

  const handleCategoryChange = (categoryId) => {
    setGameData((prev) => {
      const newCategoryIds = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId];
      return { ...prev, categoryIds: newCategoryIds };
    });
    setIsEditing(true);
  };

  const handlePlatformChange = (platform) => {
    setGameData((prev) => {
      const platformList = prev.platform ? prev.platform.split(',').map((p) => p.trim()) : [];
      const newPlatforms = platformList.includes(platform)
        ? platformList.filter((p) => p !== platform)
        : [...platformList, platform];
      return { ...prev, platform: newPlatforms.join(', ') };
    });
    setIsEditing(true);
  };

  const handleAddImage = (tempImageUrl) => {
    if (tempImageUrl.trim()) {
      setGameData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, tempImageUrl.trim()],
        tempImageUrl: '',
      }));
      setIsEditing(true);
    } else {
      toast.error('Vui lòng nhập URL hình ảnh hợp lệ');
    }
  };

  const handleRemoveImage = (index) => {
    setGameData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
    setIsEditing(true);
  };

  const platforms = ['PC', 'PS', 'Xbox', 'NS', 'iOS', 'Android'];
  const currentPlatforms = gameData.platform ? gameData.platform.split(',').map((p) => p.trim()) : [];

  return (
    <form onSubmit={(e) => onSubmit(e, gameData)} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1" htmlFor="title">Tiêu đề game</label>
        <input
          type="text"
          id="title"
          name="title"
          value={gameData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          maxLength={100}
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1" htmlFor="description">Mô tả</label>
        <textarea
          id="description"
          name="description"
          value={gameData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
          required
          placeholder="Nhập mô tả game"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1" htmlFor="price">Giá</label>
        <input
          type="number"
          id="price"
          name="price"
          value={gameData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1" htmlFor="releaseDate">Ngày phát hành</label>
        <input
          type="date"
          id="releaseDate"
          name="releaseDate"
          value={gameData.releaseDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Nền tảng</label>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <label key={platform} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={currentPlatforms.includes(platform)}
                onChange={() => handlePlatformChange(platform)}
                className="form-checkbox"
              />
              <span>{platform}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Nhà phát triển</label>
        <input
          type="text"
          id="developers"
          name="developers"
          value={gameData.developers}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Nhà phát hành</label>
        <input
          type="text"
          id="publishers"
          name="publishers"
          value={gameData.publishers}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1" htmlFor="website">Website</label>
        <input
          type="url"
          id="website"
          name="website"
          value={gameData.website}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="VD: https://game.com"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1" htmlFor="viewCount">Lượt xem</label>
        <input
          type="number"
          id="viewCount"
          name="viewCount"
          value={gameData.viewCount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          disabled={mode !== 'edit'}
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">
          <input
            type="checkbox"
            id="isGOTY"
            name="isGOTY"
            checked={gameData.isGOTY}
            onChange={handleChange}
            className="mr-2"
          />
          Game của năm
        </label>
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Danh mục</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <label key={category.categoryId} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={gameData.categoryIds.includes(category.categoryId)}
                onChange={() => handleCategoryChange(category.categoryId)}
                className="form-checkbox"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-gray-700 mb-1" htmlFor="tempImageUrl">URL hình ảnh</label>
        <div className="flex space-x-2">
          <input
            type="url"
            id="tempImageUrl"
            name="tempImageUrl"
            value={gameData.tempImageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Nhập URL hình ảnh"
          />
          <button
            type="button"
            onClick={() => handleAddImage(gameData.tempImageUrl)}
            className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
          >
            Xác nhận
          </button>
        </div>
        {gameData.imageUrls.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-700 mb-2">Hình ảnh đã chọn:</h3>
            <div className="flex flex-wrap gap-4">
              {gameData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Hình ảnh game ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-2xl"
                    onError={(e) => (e.target.src = '/placeholder.jpg')}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={!isEditing && mode === 'edit'}
          className={`${
            mode === 'add' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
          } text-white px-4 py-2 rounded-3xl ${!isEditing && mode === 'edit' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {mode === 'add' ? 'Thêm game' : 'Cập nhật game'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-3xl hover:bg-gray-600"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default GameForm;