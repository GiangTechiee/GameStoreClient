import { useState } from "react";

function GameDescription({ game }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Mô tả */}
      <div className="md:w-2/3">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả</h2>
        <div className="text-gray-600">
          <p
            className={`md:line-clamp-none ${
              isExpanded ? "line-clamp-none" : "line-clamp-5"
            }`}
          >
            {game.description}
          </p>
          <button
            onClick={toggleDescription}
            className="md:hidden text-blue-500 hover:underline mt-2"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>

      {/* Đường phân cách dọc */}
      <div className="hidden md:block w-px bg-purple-500"></div>

      {/* Chi tiết */}
      <div className="md:w-1/3">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin khác</h2>
        <p className="text-gray-600 mb-2">
          <strong>Thể loại:</strong>{" "}
          {Array.isArray(game.categoryNames) && game.categoryNames.length > 0 ? game.categoryNames.join(", ") : "-"}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Ngày phát hành:</strong>{" "}
          {new Date(game.releaseDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Nền tảng:</strong> {game.platform}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Nhà phát triển:</strong> {game.developers}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Nhà phát hành:</strong> {game.publishers}
        </p>
        <p className="text-gray-600 mb-2">
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
            "N/A"
          )}
        </p>
      </div>
    </div>
  );
}

export default GameDescription;