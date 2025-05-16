import { useState } from "react";
import GameForm from "./GameForm";
import PlatformIcons from "./PlatformIcons";

const GameDetailsModal = ({
  game,
  categories,
  onUpdate,
  onDelete,
  onClose,
  isEditing: initialIsEditing = false,
}) => {
  console.log("Game in GameDetailsModal:", game);
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [formData, setFormData] = useState({
    gameId: game.gameId || null,
    title: game.title || "",
    description: game.description || "",
    price: game.price || 0,
    releaseDate: game.releaseDate
      ? new Date(game.releaseDate).toISOString().split("T")[0]
      : "",
    platform: game.platform || "",
    developers: game.developers || "",
    publishers: game.publishers || "",
    website: game.website || "",
    viewCount: game.viewCount || 0,
    isGOTY: game.isGOTY || false,
    categoryIds: game.categoryIds || [],
    categoryNames: game.categoryNames || [],
    imageUrls: game.gameImages?.map((img) => img.imageUrl) || [],
    tempImageUrl: "",
  });

  const handleSubmit = (e, data) => {
    onUpdate(e, data);
    setIsEditing(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Sửa game" : "Chi tiết game"}
        </h2>
        {isEditing ? (
          <GameForm
            mode="edit"
            gameData={formData}
            setGameData={setFormData}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <strong>Tên game:</strong> {game.title || "-"}
            </div>
            <div>
              <strong>Mô tả:</strong> {game.description || "-"}
            </div>
            <p className="text-lg text-gray-800 font-semi">
              <strong>Giá: </strong>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(game.price)}
            </p>
            <div>
              <strong>Ngày phát hành:</strong>{" "}
              {game.releaseDate
                ? new Date(game.releaseDate).toLocaleDateString()
                : "-"}
            </div>
            <div>
              <strong>Nền tảng:</strong>{" "}
              <PlatformIcons platforms={game.platform} />
            </div>
            <div>
              <strong>Nhà phát triển:</strong> {game.developers || "-"}
            </div>
            <div>
              <strong>Nhà phát hành:</strong> {game.publishers || "-"}
            </div>
            <div>
              <strong>Website:</strong>{" "}
              {game.website ? (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {game.website}
                </a>
              ) : (
                "-"
              )}
            </div>
            <div>
              <strong>Lượt xem:</strong> {game.viewCount || 0}
            </div>
            <div>
              <strong>Game của năm:</strong> {game.isGOTY ? "Có" : "Không"}
            </div>
            <div>
              <strong>Danh mục:</strong>{" "}
              {Array.isArray(game.categoryNames) && game.categoryNames.length > 0 ? game.categoryNames.join(", ") : "-"}
            </div>
            {game.gameImages?.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-2">Hình ảnh:</h3>
                <div className="flex flex-wrap gap-4">
                  {game.gameImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.imageUrl}
                      alt={`Hình ảnh game ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-2xl"
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-3xl hover:bg-yellow-600"
              >
                Sửa
              </button>
              <button
                onClick={() => onDelete(game.gameId)}
                className="bg-red-500 text-white px-4 py-2 rounded-3xl hover:bg-red-600"
              >
                Xóa
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-3xl hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetailsModal;
