import PlatformIcons from "./PlatformIcons";
import ImageCarousel from "./ImageCarousel";

const GameCard = ({ game, onEdit, onDelete, onClick }) => {
  return (
    <div
      className="bg-white rounded-3xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick(game)}
    >
      <ImageCarousel images={game.gameImages || []} />
      <h3 className="text-lg font-semibold text-gray-800 truncate mt-2">{game.title}</h3>
      
      <p className="text-lg text-gray-800 font-semi">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(game.price)}
        </p>

      <div className="mt-2">
        <PlatformIcons platforms={game.platform} />
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(game, true);
          }}
          className="bg-yellow-500 text-white px-3 py-1 rounded-3xl hover:bg-yellow-600"
        >
          Sửa
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(game.gameId);
          }}
          className="bg-red-500 text-white px-3 py-1 rounded-3xl hover:bg-red-600"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default GameCard;